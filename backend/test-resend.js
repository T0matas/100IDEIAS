const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log("Testing Resend with key:", process.env.RESEND_API_KEY ? "Present" : "Missing");
  try {
    const data = await resend.emails.send({
      from: "100Ideias <onboarding@resend.dev>",
      to: "danieltomatas0@gmail.com",
      subject: "Teste de Conexão",
      html: "<strong>Funciona!</strong>"
    });
    console.log("Success!", data);
  } catch (error) {
    console.error("Error details:", error);
  }
}

test();
