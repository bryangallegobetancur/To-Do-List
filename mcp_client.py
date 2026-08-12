"""MCP Client que se conecta al MCP Server de la To Do List vía stdio.

Ejecuta el MCP Server como subproceso y ofrece un menú interactivo
que permite gestionar tareas usando las herramientas expuestas por el server.
"""

import asyncio

from mcp import ClientSession
from mcp.client.stdio import StdioServerParameters, stdio_client

SERVER_SCRIPT = "mcp_server.py"


async def run():
    server_params = StdioServerParameters(command="python", args=[SERVER_SCRIPT])

    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            print("Conectado al MCP Server de To Do List\n")

            while True:
                print_menu()
                option = input("Opción > ").strip()

                if option == "1":
                    result = await session.call_tool("list_tasks", {})
                    for content in result.content:
                        if hasattr(content, "text"):
                            print(content.text)
                    print()

                elif option == "2":
                    title = input("Título: ").strip()
                    desc = input("Descripción (opcional): ").strip()
                    result = await session.call_tool(
                        "create_task",
                        {"title": title, "description": desc},
                    )
                    print(result.content[0].text, "\n")

                elif option == "3":
                    tid = int(input("Id de la tarea: ").strip())
                    result = await session.call_tool("get_task", {"task_id": tid})
                    print(result.content[0].text, "\n")

                elif option == "4":
                    tid = int(input("Id de la tarea: ").strip())
                    title = input("Nuevo título (Enter para no cambiar): ").strip() or None
                    desc = input("Nueva descripción (Enter para no cambiar): ").strip() or None
                    args = {"task_id": tid}
                    if title:
                        args["title"] = title
                    if desc:
                        args["description"] = desc
                    result = await session.call_tool("update_task", args)
                    print(result.content[0].text, "\n")

                elif option == "5":
                    tid = int(input("Id de la tarea: ").strip())
                    action = input("Completar (c) / Desmarcar (d): ").strip().lower()
                    completed = action != "d"
                    result = await session.call_tool(
                        "complete_task",
                        {"task_id": tid, "completed": completed},
                    )
                    print(result.content[0].text, "\n")

                elif option == "6":
                    tid = int(input("Id de la tarea a eliminar: ").strip())
                    result = await session.call_tool("delete_task", {"task_id": tid})
                    print(result.content[0].text, "\n")

                elif option == "7":
                    print("¡Hasta luego!")
                    break

                else:
                    print("Opción inválida.\n")


def print_menu():
    print("=" * 40)
    print("  TO DO LIST — Cliente MCP")
    print("=" * 40)
    print("  1. Listar tareas")
    print("  2. Crear tarea")
    print("  3. Ver tarea")
    print("  4. Actualizar tarea")
    print("  5. Completar / Desmarcar tarea")
    print("  6. Eliminar tarea")
    print("  7. Salir")
    print("-" * 40)


if __name__ == "__main__":
    asyncio.run(run())