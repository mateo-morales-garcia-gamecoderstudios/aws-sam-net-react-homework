import { apiFetch } from "@/lib/api";
import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const RewardSchemaIdField = z.string().refine(
    (val) => objectIdRegex.test(val),
    { error: 'Invalid ObjectId format. Must be a 24-character hexadecimal string.' }
);

export const RewardSchema = z.object({
    Id: RewardSchemaIdField,
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
    const res = await apiFetch(`rewards${queryString}`);
    return RewardsResponseSchema.parse(res);
}

export const RewardsResponseSchema = z.object({
    TotalCount: z.number(),
    PageNumber: z.number(),
    PageSize: z.number(),
    Items: z.array(RewardSchema)
});

export type RewardsResponseSchema = z.infer<typeof RewardsResponseSchema>;

export const RewardsSearchNameParam = z.string().optional().catch('');
export const RewardsSearchCategoryParam = z.string().optional().catch('');

export const RewardsSearchParams = z.object({
    page: z.number().min(1).optional().catch(1),
    pageSize: z.number().min(5).max(100).optional().catch(5),
    name: RewardsSearchNameParam,
    category: RewardsSearchCategoryParam,
    // 1 asc, -1 desc, 0 disabled, asc by default of if something fails
    priceSort: z.number().min(-1).max(1).optional().default(1).catch(1),
});

export type RewardsSearchParams = z.infer<typeof RewardsSearchParams>;
