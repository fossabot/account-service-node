export default function get(ctx) {
  const {
    username,
    access,
    fn,
    ln,
    cpf,
    phones,
    emails,
    birth,
    ncode,
    photo,
    authSecondFactor
  } = ctx.user.data;

  return {
    body: {
      username,
      fn,
      ln,
      cpf,
      phones,
      emails,
      ncode,
      photo,
      access,
      authSecondFactor,
      birth
    }
  };
}
