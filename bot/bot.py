import os
import uuid
from typing import Optional

import discord
from api_client import (
    ApiConnectionError,
    attach_subject,
    create_course,
    create_student,
    create_subject,
    get_report,
    list_courses,
    list_students,
    list_subjects,
    update_progress,
)
from discord import app_commands
from dotenv import load_dotenv
from errors import (
    ApiBaseError,
    CourseNotFound,
    InvalidIDError,
    NotFoundError,
    StudentNotFound,
    SubjectNotFound,
    ValidationError,
)

load_dotenv()
TOKEN = os.getenv("DISCORD_BOT_TOKEN")
intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)


async def handle_api_error(inter: discord.Interaction, error: Exception):
    # Valor padrão caso escape dos if/else
    msg = "❌ Ocorreu um erro interno."

    # Pegamos a mensagem que foi definida lá no api_client.py
    # Ex: "O curso 992c... não existe."
    erro_msg = str(error)

    if isinstance(error, StudentNotFound):
        # O api_client manda "Aluno X não encontrado", aqui adicionamos o emoji
        msg = f"👤 **{erro_msg}**"

    elif isinstance(error, CourseNotFound):
        msg = f"🎓 **{erro_msg}**"

    elif isinstance(error, SubjectNotFound):
        msg = f"📚 **{erro_msg}**"

    elif isinstance(error, InvalidIDError):
        msg = f"🔢 **ID Inválido:** {erro_msg}"

    elif isinstance(error, ValidationError):
        msg = f"⚠️ **Não foi possível processar:** {erro_msg}"

    elif isinstance(error, ApiConnectionError):
        msg = f"🔌 **Problema de Conexão:** {erro_msg}"

    elif isinstance(error, ApiBaseError):
        msg = f"🔥 **Erro na API:** {erro_msg}"

    else:
        # Erros de código (bugs no python) continuam indo pro console
        print(f"ERRO CRÍTICO NÃO TRATADO: {error}")
        import traceback

        traceback.print_exc()
        msg = "❌ Erro interno do bot. O administrador foi notificado."

    # Lógica de envio (Followup vs Response)
    if inter.response.is_done():
        await inter.followup.send(msg, ephemeral=True)
    else:
        await inter.response.send_message(msg, ephemeral=True)


def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False


@tree.command(name="extrato", description="Mostra extrato do aluno (ID interno)")
async def extrato(inter: discord.Interaction, estudante_id: str):
    if not is_valid_uuid(estudante_id):
        await inter.response.send_message(
            "⚠️ **ID Inválido:** Por favor forneça um UUID válido.", ephemeral=True
        )
        return

    cat_map = {
        "MANDATORY": "🔴 Obrigatória",
        "OPTIONAL": "🟢 Optativa",
        "COMPLEMENTARY": "🔵 Complementar",
    }

    try:
        await inter.response.defer()
        rep = await get_report(estudante_id)
        report = rep["report"]
        msg = (
            f"**{report['student']['name']}** — {report['course']['name']}\n"
            f"Aprovadas: **{report['approvedHours']}** / {report['course']['totalHours']} "
            f"(faltam **{report['remainingHours']}**)\n"
            + "\n".join(
                [
                    f"- {cat_map[k]}: {v['done']}/{v['total']} h"
                    for k, v in report["categories"].items()
                ]
            )
        )
        await inter.followup.send(msg)
    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(
    name="atualizar_progresso",
    description="Registra a atualização de progresso em uma matéria",
)
@app_commands.describe(
    estudante_id="ID do estudante (UUID)",
    materia_id="ID da matéria (UUID)",
    status='Status da matéria ("PENDENTE", "CURSANDO", "APROVADO" ou "REPROVADO")',
    nota="Nota em caso de ter sido aprovado (int)",
)
async def atualizar_progresso(
    inter: discord.Interaction,
    estudante_id: str,
    materia_id: str,
    status: str,
    nota: Optional[int],
):
    if not is_valid_uuid(estudante_id):
        await inter.response.send_message(
            "⚠️ **ID do estudante inválido:** Por favor forneça um UUID válido.",
            ephemeral=True,
        )
        return

    if not is_valid_uuid(materia_id):
        await inter.response.send_message(
            "⚠️ **ID da matéria inválido:** Por favor forneça um UUID válido.",
            ephemeral=True,
        )
        return

    if status not in ["PENDENTE", "CURSANDO", "APROVADO", "REPROVADO"]:
        await inter.response.send_message(
            '⚠️ **Status inválido:** deve ser "PENDENTE", "CURSANDO", "APROVADO" ou "REPROVADO".',
            ephemeral=True,
        )
        return

    if status == "APROVADO" and not nota:
        await inter.response.send_message(
            "⚠️ **Nota faltante:** Em caso de status `APROVADO`, uma `nota` deve ser fornecida.",
            ephemeral=True,
        )
        return

    if status != "APROVADO":
        nota = None

    try:
        await inter.response.defer()

        r = await update_progress(estudante_id, materia_id, status, nota)

        msg = f"✅ **Sucesso!**\nProgresso do estudante `{estudante_id}` atualizado!"

        await inter.followup.send(msg)
    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(
    name="listar_materias", description="Listar todas as matérias cadastradas"
)
async def listar_materias(inter: discord.Interaction):
    try:
        await inter.response.defer()

        data = await list_subjects()
        subjects = data.get("subjects", [])

        if not subjects:
            await inter.followup.send("📭 Nenhuma matéria cadastrada.")
            return

        # Cabeçalho
        header = "📚 **Grade Curricular Disponível**\n\n"
        lines = []

        # Mapeamento de categorias para emojis/texto
        cat_map = {
            "MANDATORY": "🔴 Obrigatória",
            "OPTIONAL": "🟢 Optativa",
            "COMPLEMENTARY": "🔵 Complementar",
        }

        for sub in subjects:
            # Ex: 📕 **MAT101** — Cálculo I (80h)
            # Traduz a categoria ou usa a original se não achar no mapa
            categoria_formatada = cat_map.get(sub["category"], sub["category"])

            # Monta a linha
            linha = (
                f"**{sub['code']}** — {sub['name']}  | 🆔 `{sub['id']}`\n"
                f"⏱️ {sub['hours']}h  |  🏷️ {categoria_formatada}"
            )

            lines.append(linha)

        # --- Lógica de Paginação Simples (Chunking) ---
        # O Discord limita mensagens a 2000 caracteres.
        # Vamos agrupar as linhas e enviar blocos de mensagens.

        message_chunks = []
        current_chunk = header

        for line in lines:
            # Se adicionar a próxima linha passar de 1900 chars (margem de segurança),
            # fecha o bloco atual e começa um novo.
            if len(current_chunk) + len(line) + 4 > 1900:
                message_chunks.append(current_chunk)
                current_chunk = ""  # Novo bloco sem cabeçalho

            current_chunk += f"{line}\n\n"  # Adiciona linha e quebra dupla

        if current_chunk:
            message_chunks.append(current_chunk)

        # Envia cada pedaço como uma mensagem separada
        for msg in message_chunks:
            await inter.followup.send(msg)

    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(name="listar_cursos", description="Lista todos os cursos disponíveis")
async def listar_cursos(inter: discord.Interaction):
    try:
        await inter.response.defer()

        data = await list_courses()
        courses = data.get("courses", [])

        if not courses:
            await inter.followup.send("📭 Nenhum curso encontrado.")
            return

        # Cabeçalho
        header = "🎓 **Cursos Disponíveis**\n\n"
        lines = []

        for course in courses:
            # Formatação focada em clareza
            # Colocamos o ID em `código` para facilitar copiar/colar se precisar usar em outro comando
            linha = (
                f"**{course['name']}**\n"
                f"⏳ {course['totalHours']} horas  |  🆔 `{course['id']}`"
            )
            lines.append(linha)

        # --- Lógica de Paginação (Chunking) ---
        message_chunks = []
        current_chunk = header

        for line in lines:
            # Verifica limite de 2000 caracteres com margem de segurança
            if len(current_chunk) + len(line) + 4 > 1900:
                message_chunks.append(current_chunk)
                current_chunk = ""

            current_chunk += f"{line}\n\n"

        if current_chunk:
            message_chunks.append(current_chunk)

        # Envia as mensagens
        for msg in message_chunks:
            await inter.followup.send(msg)

    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(
    name="cadastrar_materia_curso", description="Vincula uma matéria a um curso"
)
@app_commands.describe(curso_id="ID do Curso (UUID)", materia_id="ID da Matéria (UUID)")
async def cadastrar_materia_curso(
    inter: discord.Interaction, curso_id: str, materia_id: str, semestre: int
):
    # 1. Validação básica local para economizar API
    if not is_valid_uuid(curso_id) or not is_valid_uuid(materia_id):
        await inter.response.send_message(
            "⚠️ **IDs Inválidos:** Verifique se ambos são UUIDs.", ephemeral=True
        )
        return

    try:
        await inter.response.defer()

        # 2. Chama a API
        await attach_subject(curso_id, materia_id, semestre)

        # 3. Confirmação
        # Como a API geralmente retorna 200/204 sem muitos dados no attach,
        # montamos uma mensagem de sucesso manual.
        await inter.followup.send(
            f"✅ **Sucesso!**\n"
            f"A matéria `{materia_id}` foi vinculada ao curso `{curso_id}`.",
        )

    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(name="cadastrar_curso", description="Cadastra um curso")
@app_commands.describe(
    nome="Nome do curso (str)", total_horas="Total de horas do curso (int)"
)
async def cadastrar_curso(inter: discord.Interaction, nome: str, total_horas: int):
    try:
        await inter.response.defer()

        await create_course(nome, total_horas)

        await inter.followup.send(
            f"✅ **Sucesso!**\nO curso `{nome}` foi cadastrado.",
        )

    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(name="cadastrar_estudante", description="Cadastra um estudante")
@app_commands.describe(
    nome="Nome do estudante (str)",
    email="Email do estudante",
    curso_id="ID do curso que ele faz (UUID)",
)
async def cadastrar_estudante(
    inter: discord.Interaction, nome: str, email: str, curso_id: str
):
    try:
        await inter.response.defer()

        await create_student(nome, email, curso_id)

        await inter.followup.send(
            f"✅ **Sucesso!**\nO estudante `{nome}`, com email `{email}`, foi cadastrado.",
        )

    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(
    name="listar_estudantes", description="Lista todos os estudantes cadastrados"
)
async def listar_estudantes(inter: discord.Interaction):
    try:
        await inter.response.defer()

        data = await list_students()
        students = data.get("students", [])

        if not students:
            await inter.followup.send("📭 Nenhum estudante cadastrado.")
            return

        # Cabeçalho
        header = "🧑‍🎓 **Estudantes Cadastrados**\n\n"
        lines = []

        for student in students:
            # Formatação focada em clareza
            # Colocamos o ID em `código` para facilitar copiar/colar se precisar usar em outro comando
            linha = (
                f"**{student['name']}**\n📧 `{student['email']}`\n🆔 `{student['id']}`"
            )
            lines.append(linha)

        # --- Lógica de Paginação (Chunking) ---
        message_chunks = []
        current_chunk = header

        for line in lines:
            # Verifica limite de 2000 caracteres com margem de segurança
            if len(current_chunk) + len(line) + 4 > 1900:
                message_chunks.append(current_chunk)
                current_chunk = ""

            current_chunk += f"{line}\n\n"

        if current_chunk:
            message_chunks.append(current_chunk)

        # Envia as mensagens
        for msg in message_chunks:
            await inter.followup.send(msg)

    except Exception as e:
        await handle_api_error(inter, e)


@tree.command(name="cadastrar_materia", description="Cadastra uma nova matéria")
@app_commands.describe(
    codigo="Código da matéria (str)",
    nome="Nome da matéria (str)",
    horas="Duração em horas da matéria (int)",
    categoria='Categoria da matéria ("OBRIGATORIA", "OPTATIVA" ou "COMPLEMENTAR")',
)
async def cadastrar_materia(
    inter: discord.Interaction, codigo: str, nome: str, horas: int, categoria: str
):
    if categoria not in ["OBRIGATORIA", "OPTATIVA", "COMPLEMENTAR"]:
        await inter.response.send_message(
            '⚠️ **Categoria inválida:** deve ser "OBRIGATORIA", "OPTATIVA" ou "COMPLEMENTAR".',
            ephemeral=True,
        )
        return

    try:
        await inter.response.defer()

        await create_subject(codigo, nome, horas, categoria)

        await inter.followup.send(
            f"✅ **Sucesso!**\nA matéria `{codigo} - {nome}` foi cadastrada.",
        )

    except Exception as e:
        await handle_api_error(inter, e)


# Server Vinicius
MY_GUILD = discord.Object(id=1441485443341353094)

# Server Mateus
# MY_GUILD = discord.Object(id=1398317901684936804)

# Server Mirna
# MY_GUILD = discord.Object(id=)


@client.event
async def on_ready():
    tree.copy_global_to(guild=MY_GUILD)
    await tree.sync(guild=MY_GUILD)
    print(f"Logado como {client.user}")


client.run(TOKEN)
