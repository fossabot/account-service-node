export default async function finish(ctx, app) {
  try {
    await ctx.busboy.finish();

    const { name, cpf, birth, pw } = ctx.body;
    const user = await app.data.users.get(cpf);

    if (user) {
      return {
        content: {
          fn: user.fn,
          status:
            "cpf already registred, if you owner it and don't have make the registry, you can request now an audiencie to prove the ownership"
        }
      };
    }

    if (!(await trustCPF(cpf, birth)))
      return {
        error: {
          statusCode: 400,
          message: "invalid-cpf"
        }
      };

    const newUser = await app.models.users.create({ name, cpf, birth, pw });

    return {
      content: { id: newUser.id }
    };
  } catch (e) {
    app.reporter("error", "register:create", {
      error: e.message
    });
    console.error(e);

    return {
      error: {
        statusCode: 500
      }
    };
  }
}

async function trustCPF(cpf, birth) {
  // regex(cpf) &&
  // rf_api(cpf) &&
  // compare rf_response.data.birth === birth
  return true;
}
