/**
 * Solution based on RFC4122 Version 4 
 * Note: Avoids collision by offsetting the first 13hex numbers by a hex portion of the timestamp
 *       This way if Math.random() is on the same seed, both clients would have to generate the UUID at the exact same millisecond
 */
export function generateUUID() {
  let d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
