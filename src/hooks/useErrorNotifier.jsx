import { useToast } from "@/lib/toast/context";

const getErrorMessage = (_error) => {
  let error = _error.error || _error;
  if (!error || !error.message) {
    return "Unexpected Error Occured";
  }

  if (error?.data?.originalError?.message) {
    return error.data.originalError.message
      .trim()
      .replace("execution reverted: ", "");
  }

  return error.message.trim().replace("MetaMask Tx Signature: ", "");
};

export const useErrorNotifier = ({ duration } = {}) => {
  const toast = useToast();

  const notifyError = (error, action = "perform action") => {
    const title =
      typeof error.data === "string" ? error.data : `Could not ${action}`;

    console.error(error);

    toast?.pushError({
      title: title,
      message: getErrorMessage(error),
      lifetime: duration || 5000,
    });
  };

  return { notifyError };
};