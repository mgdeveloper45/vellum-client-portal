import { prisma } from "@/lib/prisma";

type SearchWorkspaceQueryInput = {
  query: string;
  userId: string;
  isAdmin: boolean;
};

export async function searchWorkspaceQuery({
  query,
  userId,
  isAdmin,
}: SearchWorkspaceQueryInput) {
  if (!query) {
    return {
      clients: [],
      projects: [],
      messages: [],
      files: [],
    };
  }

  const projectFilter = isAdmin
    ? {}
    : {
        clientId: userId,
      };

  const [clients, projects, messages, files] = await Promise.all([
    prisma.user.findMany({
      where: isAdmin
        ? {
            role: "CLIENT",
            OR: [
              {
                firstName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {
            id: userId,
            role: "CLIENT",
            OR: [
              {
                firstName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
      take: 5,
    }),

    prisma.project.findMany({
      where: {
        ...projectFilter,
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 5,
    }),

    prisma.message.findMany({
      where: {
        content: {
          contains: query,
          mode: "insensitive",
        },
        project: projectFilter,
      },
      include: {
        project: true,
      },
      take: 5,
    }),

    prisma.projectFile.findMany({
      where: {
        project: projectFilter,
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            fileType: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            url: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        project: true,
      },
      take: 5,
    }),
  ]);

  return {
    clients,
    projects,
    messages,
    files,
  };
}
