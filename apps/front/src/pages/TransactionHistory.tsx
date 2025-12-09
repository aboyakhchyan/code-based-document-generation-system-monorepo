import { DashboardContent, DashboardHeader } from "@/components/dashboard";
import { usePageMeta, usePaymentApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ClipboardClock, User, Mail, Calendar, Hash } from "lucide-react";
import { Table, TableHeader, TableBody, Th, Td, Tr, Spinner } from "@/components/ui";
import { getFullDateTimeHy, getStatusColor } from "@/utils/formatter";
import { getStatusText } from "@/utils";

interface IPaymentTransactionWithUser {
  id: string;
  amount: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export const TransactionHistory = () => {
  usePageMeta("Գործարքների պատմություն", "Դիտեք ձեր վճարումների և բաժանորդագրության գործարքների պատմությունը։");

  const { getTransactionHistoryApi } = usePaymentApi();

  const {
    data,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["transaction-history"],
    queryFn: getTransactionHistoryApi,
  });

  const transactions = (data as IPaymentTransactionWithUser[]) || [];

  if (isHistoryLoading) {
    return (
      <div>
        <DashboardHeader>
          <div className="w-full flex items-center gap-3 px-4 py-3">
            <ClipboardClock size={28} className="text-primary-700" />
            <h1 className="text-xl font-semibold text-primary-800">Գործարքների պատմություն</h1>
          </div>
        </DashboardHeader>
        <DashboardContent>
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" label="Բեռնվում է..." />
          </div>
        </DashboardContent>
      </div>
    );
  }

  if (isHistoryError) {
    return (
      <div>
        <DashboardHeader>
          <div className="w-full flex items-center gap-3 px-4 py-3">
            <ClipboardClock size={28} className="text-primary-700" />
            <h1 className="text-xl font-semibold text-primary-800">Գործարքների պատմություն</h1>
          </div>
        </DashboardHeader>
        <DashboardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 text-base font-medium mb-2">Սխալ է տեղի ունեցել</p>
            <p className="text-gray-600 text-sm">Հնարավոր չէ բեռնել գործարքների պատմությունը</p>
          </div>
        </DashboardContent>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader>
        <div className="w-full flex items-center gap-3 px-4 py-3">
          <ClipboardClock size={28} className="text-primary-700" />
          <h1 className="text-xl font-semibold text-primary-800">Գործարքների պատմություն</h1>
          {transactions.length > 0 && (
            <span className="ml-auto text-sm text-gray-500 font-normal">Ընդամենը: {transactions.length}</span>
          )}
        </div>
      </DashboardHeader>
      <DashboardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ClipboardClock size={56} className="text-gray-300 mb-3" />
            <p className="text-gray-600 text-base font-medium">Գործարքներ չկան</p>
            <p className="text-gray-500 text-sm mt-1">Դուք դեռ չունեք գործարքների պատմություն</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <Table className="min-w-full">
              <TableHeader>
                <Tr>
                  <Th className="px-4 py-2.5 text-xs">ID</Th>
                  <Th className="px-4 py-2.5 text-xs">Գումար</Th>
                  <Th className="px-4 py-2.5 text-xs">Կարգավիճակ</Th>
                  <Th className="px-4 py-2.5 text-xs">Ամսաթիվ</Th>
                  <Th className="px-4 py-2.5 text-xs">Օգտատեր</Th>
                </Tr>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <Tr key={transaction.id} even={index % 2 === 0} className="hover:bg-gray-50 transition-colors">
                    <Td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-gray-400" />
                        <span className="font-mono text-gray-600">{transaction.id}</span>
                      </div>
                    </Td>
                    <Td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary-700">{transaction.amount}</span>
                      </div>
                    </Td>
                    <Td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {getStatusText(transaction.status)}
                      </span>
                    </Td>
                    <Td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{getFullDateTimeHy(new Date(transaction.createdAt))}</span>
                      </div>
                    </Td>
                    <Td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900 text-xs">{transaction.user.fullName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-gray-500 text-xs truncate max-w-[200px]">{transaction.user.email}</span>
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DashboardContent>
    </div>
  );
};
