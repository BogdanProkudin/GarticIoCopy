export const useGetRoomIdFromUrl = () => {
  const currentUrl = window.location.href;
  const parts = currentUrl.split("/");
  return parts[parts.length - 1];
};
