import { env } from "@/lib/env";
import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const RewardSchema = z.object({
    Id: z.string().refine(
        (val) => objectIdRegex.test(val),
        { error: 'Invalid ObjectId format. Must be a 24-character hexadecimal string.' }
    ),
    Name: z.string().nonempty().max(100),
    Description: z.string().nonempty().max(500),
    Price: z.number().gt(0),
    Category: z.string().nonempty().max(50),
    ImageUrl: z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain
    }),
});

export type RewardSchema = z.infer<typeof RewardSchema>;

export const fetchRewards = async (search: RewardsSearchParams): Promise<RewardsResponseSchema> => {
    const filter = Object.fromEntries(Object.entries(search).map(([key, value]) => [key, String(value)]));
    const queryString = `?${new URLSearchParams(filter)}`;
    console.log('🗑️', queryString, filter);
    const res = await fetch(`${env.VITE_API_BASE_URL}rewards${queryString}`);
    if (!res.ok) throw new Error('Failed to fetch rewards');
    const body = await res.json();
    return RewardsResponseSchema.parse(body);
}

export const RewardsResponseSchema = z.object({
    TotalCount: z.number(),
    PageNumber: z.number(),
    PageSize: z.number(),
    Items: z.array(RewardSchema)
});

type RewardsResponseSchema = z.infer<typeof RewardsResponseSchema>;

export const RewardsSearchParams = z.object({
    page: z.number().min(1).optional().catch(1),
    pageSize: z.number().min(5).max(100).optional().catch(5),
    name: z.string().optional().catch(''),
    category: z.string().optional().catch(''),
    // only accepts -1 or 1, it defaults to 1 an invalid value is provided
    priceSort: z.union([z.literal(-1), z.literal(1)]).catch(1),
});

type RewardsSearchParams = z.infer<typeof RewardsSearchParams>;
