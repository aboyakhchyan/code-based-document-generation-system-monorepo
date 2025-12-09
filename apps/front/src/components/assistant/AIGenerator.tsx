import { useEffect, useMemo, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { Button, TextArea, cn } from "../ui";
import { Brain, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks";

type AuthorType = "user" | "assistant";

interface IMessage {
  id: string;
  author: AuthorType;
  content: string;
  createdAt: number;
}

interface IAIGeneratorProps {
  onSetIsPlanDetailsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const createMessage = (author: AuthorType, content: string): IMessage => ({
  id: `${author}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
  author,
  content,
  createdAt: Date.now(),
});

export const AIGenerator: React.FC<IAIGeneratorProps> = ({ onSetIsPlanDetailsModalOpen }) => {
  const { user } = useAuth();
  const isSubscribed = user?.isSubscribed;
  const [messages, setMessages] = useState<IMessage[]>([
    createMessage(
      "assistant",
      "Բարի գալուստ AI գեներատոր։ Գրեք ձեր հրահանգը, և մենք շուտով կօգնենք ձեզ ստեղծել համապատասխան բլոկներ փաստաթղթի համար।"
    ),
  ]);
  const [prompt, setPrompt] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleOpenPlanDetailsModal = () => {
    onSetIsPlanDetailsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const isPromptValid = useMemo(() => prompt.trim().length > 0, [prompt]);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!isPromptValid || isPending) return;

    const userMessage = createMessage("user", prompt.trim());
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsPending(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          "Շուտով այստեղ կհայտնվի ստեղծված բովանդակությունը։ Մենք աշխատում ենք ինտեգրացիայի վրա՝ փաստաթուղթը ավտոմատ լրացնելու համար։"
        ),
      ]);
      setIsPending(false);
    }, 800);
  };

  return (
    <section className="relative flex h-full justify-between flex-col gap-4 rounded-2xl border border-gray-200 p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary-950">AI գեներատոր</h2>
          <p className="text-sm text-gray-500">
            Նկարագրեք փաստաթուղթի բովանդակությունն ու նպատակը՝ որպեսզի համակարգը ստեղծի այն
          </p>
        </div>
      </header>

      {/* <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-gray-50 p-3 pr-2">
        {messages.map((message) => {
          const isUser = message.author === "user";
          return (
            <article
              key={message.id}
              className={cn(
                "flex w-fit max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-3 text-sm shadow-sm transition-colors",
                isUser ? "ml-auto bg-primary-100 text-white" : "bg-white text-primary-950 border border-gray-200"
              )}
            >
              <span className="text-xs uppercase tracking-wide text-gray-400">{isUser ? "Դուք" : "AI օգնական"}</span>
              <p className="leading-relaxed text-current">{message.content}</p>
            </article>
          );
        })}
      </div> */}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextArea
          value={prompt}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setPrompt(event.target.value)}
          placeholder="օրինակ՝ «Ստեղծիր փաստաթուղթ, որտեղ կան վերնագիր, կոնտակտային տվյալներ, հմտություններ և աշխատանքային փորձ»"
          className="min-h-[100px] resize-none placeholder:text-xs border-1 rounded-2xl border-gray-200 p-2"
        />
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#EEAECA] to-[#94BBE9] font-bold"
            disabled={!isPromptValid || isPending}
          >
            {isPending ? "AI-ն մտածում է…" : "Գեներացնել"}
            <Brain size={20} className={cn(isPending && "animate-spin")} />
          </Button>
        </div>
      </form>
      {!isSubscribed && (
        <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-[#EEAECA]/95 via-white/85 to-[#94BBE9]/95 text-center text-primary-950 backdrop-blur-sm opacity-90 select-none">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary-900">
            <CreditCard size={18} className="text-white" />
          </div>
          <Button
            onClick={handleOpenPlanDetailsModal}
            className="inline-flex w-full xs:text-sm lg:text-md items-center gap-2 rounded-xl bg-primary-900 px-6 py-2.5 font-semibold text-white shadow-lg transition-transform duration-200 hover:bg-primary-800"
          >
            Ակտիվացնել բաժանորդագրությունը
          </Button>
        </div>
      )}
    </section>
  );
};
