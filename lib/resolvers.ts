import { AuthenticationError, UserInputError } from "apollo-server-micro";
import { QueryResolvers, MutationResolvers } from "./type-defs.graphqls";
import { ResolverContext } from "./apollo";
import prisma from "./prisma";

const Query: Required<QueryResolvers<ResolverContext>> = {
  async viewer(_parent, _args, _context, _info) {
    try {
      const email = _context?.session?.user?.email;

      if (email) {
        return prisma.user.findUnique({
          where: {
            email,
          },
        });
      }
    } catch (error) {
      throw new AuthenticationError(
        "Authentication token is invalid, please log in"
      );
    }
  },
  async post(_parent, _args, _context, _info) {
    return prisma.post.findMany({
      skip: _args.skip ?? 0,
      take: _args.take ?? undefined,
      orderBy:
        _args.sortOrder === "popularity"
          ? [{ likes: { _count: "desc" } }, { createdAt: "desc" }]
          : [{ createdAt: "desc" }],
      where:
        _args.id !== undefined || _args.id !== null
          ? {
              id: _args.id,
            }
          : undefined,
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          include: {
            author: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
  },
};

const Mutation: Required<MutationResolvers<ResolverContext>> = {
  async addPost(_parent, { content }, _context, _info) {
    const email = _context?.session?.user?.email;
    let user;
    const createdAt = new Date();
    if (email) {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
    }
    console.log({ user });
    return prisma.post.create({
      data: { content, authorId: user?.id, createdAt },
    });
  },
  async addComment(_parent, { postId, content }, _context, _info) {
    const email = _context?.session?.user?.email;
    let user;
    const createdAt = new Date();
    if (email) {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
    }
    return prisma.comment.create({
      data: { content, authorId: user?.id, postId },
    });
  },
  async addLike(_parent, { postId, doUnlike }, _context, _info) {
    const email = _context?.session?.user?.email;
    let user;
    if (email) {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
    }
    if (doUnlike) {
      if (user?.id) {
        await prisma.like.deleteMany({
          where: {
            postId,
            authorId: user?.id,
          },
        });
      }

      return;
    }
    return prisma.like.create({
      data: { postId, authorId: user?.id },
    });
  },
};

export default { Query, Mutation };
