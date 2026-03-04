import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { UZBEKISTAN_ZIPCODES } from "@/lib/constants/zipcodes";

const inputSchema = z.object({
  title: z.string().min(1).max(120),
  goal_description: z.string().min(1).max(2000),
  area_size_m2: z.number().min(1).max(1_000_000),
  season: z.enum(["spring", "summer", "autumn", "winter"]),
  zipcode: z.enum(UZBEKISTAN_ZIPCODES),
  language: z.enum(["en", "ru", "uz"]).default("en"),
});

const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

const planSchema = z.object({
  summary: z.string(),
  steps: z.array(z.string()).min(3).max(12),
  materials: z.array(z.string()).min(2).max(12),
  timeline_weeks: z.number().int().min(1).max(26),
  risks: z.array(z.string()).min(1).max(10),
  local_notes: z.string(),
});

function resolveGroqModel(): string {
  const configuredModel = process.env.GROQ_MODEL ?? process.env.OPENAI_MODEL;

  if (!configuredModel || configuredModel === "gpt-4o-mini") {
    return DEFAULT_GROQ_MODEL;
  }

  return configuredModel;
}

function languageLabel(language: z.infer<typeof inputSchema>["language"]): string {
  if (language === "ru") return "Russian";
  if (language === "uz") return "Uzbek";
  return "English";
}

function buildFallbackPlan(input: z.infer<typeof inputSchema>) {
  if (input.language === "ru") {
    return {
      summary: `Стартовый экоплан для проекта «${input.title}»`,
      steps: [
        `Измерьте участок ${input.area_size_m2} м² и разделите его на приоритетные зоны.`,
        `Подготовьте верхний слой почвы и уберите мусор до начала работ в сезон ${input.season}.`,
        "Запустите пилотную зону и отслеживайте прогресс каждую неделю.",
        "Масштабируйте подход на остальные зоны с учетом результатов пилота.",
      ],
      materials: [
        "Рабочие перчатки",
        "Ручные инструменты (лопата/грабли)",
        "Оборудование для полива",
        "Компост или органический улучшитель почвы",
      ],
      timeline_weeks: 6,
      risks: [
        "Нерегулярный график ухода",
        "Переувлажнение или недостаточный полив на старте",
      ],
      local_notes: `Резервный план создан без внешнего ИИ и адаптирован под индекс ${input.zipcode} для сезона ${input.season}.`,
    };
  }

  if (input.language === "uz") {
    return {
      summary: `${input.title} loyihasi uchun boshlang'ich ekologik reja`,
      steps: [
        `${input.area_size_m2} m² maydonni o'lchab, uni ustuvor zonalarga ajrating.`,
        `${input.season} mavsumidagi ishlar boshlanishidan oldin tuproqning yuqori qatlamini tayyorlang va chiqindilarni olib tashlang.`,
        "Pilot zonani ishga tushiring va har hafta natijalarni kuzatib boring.",
        "Pilot tajribasi asosida qolgan zonalarga bosqichma-bosqich kengaytiring.",
      ],
      materials: [
        "Ishchi qo'lqoplar",
        "Qo'l asboblari (belkurak/tirmoq)",
        "Sug'orish jihozlari",
        "Kompost yoki organik tuproq yaxshilagichi",
      ],
      timeline_weeks: 6,
      risks: [
        "Parvarish jadvaliga doimiy amal qilinmasligi",
        "Boshlanish bosqichida ortiqcha yoki kam sug'orish",
      ],
      local_notes: `Ushbu zaxira reja tashqi IIsiz tuzildi va ${input.season} mavsumi uchun ${input.zipcode} indeksiga moslashtirildi.`,
    };
  }

  return {
    summary: `Starter eco plan for ${input.title}`,
    steps: [
      `Measure and map the ${input.area_size_m2} m² area, then split it into priority zones.`,
      `Prepare the top soil and remove debris before ${input.season} implementation starts.`,
      "Plant or install the first pilot section and monitor weekly progress.",
      "Expand to remaining zones using lessons from the pilot section.",
    ],
    materials: [
      "Work gloves",
      "Hand tools (shovel/rake)",
      "Watering equipment",
      "Compost or organic soil improver",
    ],
    timeline_weeks: 6,
    risks: [
      "Inconsistent maintenance schedule",
      "Over- or under-watering during early setup",
    ],
    local_notes: `This fallback plan is generated without external AI and tailored to zipcode ${input.zipcode} for ${input.season}.`,
  };
}

function resolveGroqModel(): string {
  const configuredModel = process.env.GROQ_MODEL ?? process.env.OPENAI_MODEL;

  if (!configuredModel || configuredModel === "gpt-4o-mini") {
    return DEFAULT_GROQ_MODEL;
  }

  return configuredModel;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = inputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ plan: buildFallbackPlan(parsed.data) });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const prompt = {
      role: "user" as const,
      content: [
        "Generate a structured eco action plan as JSON ONLY (no markdown, no prose).",
        "Return this exact shape:",
        JSON.stringify(
          {
            summary: "string",
            steps: ["string"],
            materials: ["string"],
            timeline_weeks: 6,
            risks: ["string"],
            local_notes: "string",
          },
          null,
          2,
        ),
        "Constraints:",
        "- Keep it practical for an MVP demo, 3–12 steps.",
        "- Materials should be concrete items.",
        "- Timeline in weeks (1–26).",
        "- Local notes should mention the provided zipcode and season, but do NOT claim real climate/geo facts.",
        `- All textual fields MUST be written in ${languageLabel(parsed.data.language)}.`,
        "",
        "Input:",
        JSON.stringify(parsed.data, null, 2),
      ].join("\n"),
    };

    const completion = await client.chat.completions.create({
      model: resolveGroqModel(),
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that outputs valid JSON only. No markdown.",
        },
        prompt,
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";
    let planJson: unknown;
    try {
      planJson = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Model did not return valid JSON", raw: content },
        { status: 502 },
      );
    }

    const validated = planSchema.safeParse(planJson);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Plan JSON failed validation", raw: planJson },
        { status: 502 },
      );
    }

    return NextResponse.json({ plan: validated.data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
