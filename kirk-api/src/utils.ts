export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export const hasOwnProperty = <X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> =>  {
  return obj.hasOwnProperty(prop)
}
