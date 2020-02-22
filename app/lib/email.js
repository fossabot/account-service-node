export default function email() {
  return {
    send(to, content, attachs) {
      return console.log(
        "send email to:\n",
        to,
        "\ncontent:\n",
        content,
        "\nattachs:\n",
        attachs
      );
    }
  };
}
