export default async function updateAuthMode({ busboy, body, user }, app) {
  const { twoFactors } = body;

  await user.update({ twoFactors: twoFactors === "true" });

  return { content: { message: "ok" } };
}
