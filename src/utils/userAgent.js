export const getIsMobile = () => {
  const devices = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return devices.some((device) => navigator.userAgent.match(device));
};
