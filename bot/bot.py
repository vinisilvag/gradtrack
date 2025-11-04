import os, discord
from discord import app_commands
from dotenv import load_dotenv
from api_client import get_report

load_dotenv()
TOKEN = os.getenv("DISCORD_BOT_TOKEN")
intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

@tree.command(name="extrato", description="Mostra extrato do aluno (ID interno)")
async def extrato(inter: discord.Interaction, aluno_id: str):
  try:
    rep = await get_report(aluno_id)
    msg = (f"**{rep['student']['name']}** — {rep['course']['name']}\n"
           f"Aprovadas: **{rep['approvedHours']}** / {rep['course']['totalHours']} "
           f"(faltam **{rep['remainingHours']}**)\n" +
           "\n".join([f"- {k}: {v['done']}/{v['total']} h" for k,v in rep['categories'].items()]))
    await inter.response.send_message(msg)
  except Exception as e:
    await inter.response.send_message(f"❌ {e}")

@client.event
async def on_ready():
  await tree.sync()
  print(f"Logado como {client.user}")

client.run(TOKEN)
