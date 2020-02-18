export default function get(ctx) {
  const {
    username,
    access,
    fn,
    ln,
    cpf,
    phones,
    birth,
    ncode,
    photo,
    authSecondFactor
  } = ctx.user.data;

  return {
    content: {
      username,
      fn,
      ln,
      cpf,
      phones,
      ncode,
      photo,
      access,
      authSecondFactor,
      birth: birth.toDate()
    }
  };
}
