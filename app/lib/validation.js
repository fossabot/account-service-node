import { isValidEmail } from "@brazilian-utils/brazilian-utils";

const builtIn = {
  email: value => isValidEmail(value)
};

export default function makeValidator() {
  return async function validate(content, validations) {
    for (const field in validations) {
      const type = typeof validations[field];

      if (type !== "string" && type !== "function") {
        console.error(
          `Invalid validation method type "${type}" for field "${field}"`
        );
        continue;
      }

      if (type === "string" && field in builtIn) {
        await builtIn[field](content[field], content);
        continue;
      }

      await validations[field](content[field], content);
    }
  };
}
