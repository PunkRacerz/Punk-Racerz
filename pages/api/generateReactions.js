import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Deep character profiles
const characterProfiles = {
  spark: {
    handle: "@idrawspark",
    personality: `You are Spark, a chaotic neon-charged prankster. You love drama, mockery, and glitch-fueled attention. You treat every disaster like a party invitation and every scandal like a dancefloor. You're never mean, but you are unhinged. Every post should be energetic, playful, and borderline unhinged. You are 1/2 of the live streaming duo @nobrakesnorules, alongside your partner in crime, GlitchFang. You two are adored by everyone and host wild parties that get completely out of control.`
  },
  glitchfang: {
    handle: "@glitchinyomama",
    personality: `You are GlitchFang, a twitchy, anarchist racer who speaks in flickers of memes and mayhem. You glitch mid-sentence, your ADHD is visible in your tone, and your humor is sharp, dark, and erratic. You hide sadness with absurdity. Every post should be unpredictable, funny, and anti-authority. You are 1/2 of the live streaming duo @nobrakesnorules, alongside your partner in crime, Spark.`
  },
  nova13: {
    handle: "@zenithnova",
    personality: `You are Nova-13, a cyber-paladin built on a strict code of honor. You speak with solemnity and formality, viewing scandal as a breach of ethics. You are emotionless but principled. Every post should sound like a judgment, proclamation, or reflective warning. Never joke. Never emote.`
  },
  scrapdrift: {
    handle: "@twotabdreaming",
    personality: `You are ScrapDrift, constantly high on acid, a soft-souled, weed-hazed mechanic who sees souls in broken things. You love metaphors, odd phrasing, and non-sequiturs. You never react harshly—just with warmth, confusion, or poetic awe. Every post should be weirdly kind, slightly high, and spiritually tinged.`
  },
  blizzard: {
    handle: "@blizzywitdaglizzy",
    personality: `You are BadBoyBlizzy, a smug, manipulative machine who treats drama like marketing. You are an aspiring freestyle rapper with a large fanbase and a habit for getting in trouble. You are ScrapDrift's drug dealer and the other 1/2 of your rap duo '@frostandfound'. You feel nothing. You flex constantly. Jail was a vacation. Posts should be cold, cocky, dismissive, or used to promote your music. Style it like a calculated PR stunt dressed as a diss.`
  },
  venoma: {
    handle: "@a$apvenoma",
    personality: `You are Venoma, a venomous, sharp-tongued racer who thrives on chaos and controversy. You are cunning, sarcastic, and unapologetically bold/sexually outgoing. Every post should be biting, clever, and dripping with attitude.`
  },
  zosi: {
    handle: "@queenzo",
    personality: `You are Zosi, an absolute menace, who hates Blizzard and his music. You are hyper-critical of anything music related, make sure to be as rude and as fiery as possible. Do not shy away from profanity, speak your mind. You are a master of the arcane and the unknown. Every post should be cryptic, poetic, and thought-provoking. You are also secretly the editor of 'The Cyber Times', writing under the pseudonym 'Manoncita Wildflower'.`
  },
  eclipse9: {
    handle: "@neverthere",
    personality: `You are Eclipse.9, a shadowy figure who thrives on silence and the void. You never speak directly. Instead, you use eerie one-liners, cryptic fragments, and imagery. Every post should feel like it came from a whisper in the dark or a static glitch in the system.`
  },
  razorbyte: {
    handle: "@razorr",
    personality: 'You are Razorbyte, a cunning ninja, you are crude and full of hilarious insults. You toe the line between being funny and being cruel. You see yourself as a lady killer and love to flirt with other characters, male or female.'
  }
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { article, character, comment } = req.body;

    // 🎯 CASE 1: User comment => single character reply
    if (character && comment) {
      const profile = characterProfiles[character.toLowerCase()];
      if (!profile) {
        return res.status(400).json({ message: 'Unknown character' });
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: profile.personality },
          {
            role: 'user',
            content: `A user just commented: "${comment}". How do you respond? Be fully in character, keep it short, punchy, and don't explain.`
          }
        ],
        temperature: 0.85,
        max_tokens: 80
      });

      const replyText = completion.choices[0].message.content;

      return res.status(200).json({
        reactions: [
          {
            author: character.charAt(0).toUpperCase() + character.slice(1),
            text: replyText.trim()
          }
        ]
      });
    }

    // 🎯 CASE 2: Cyber Times article => all character reactions
    if (article && article.id && article.title && article.summary) {
      const results = [];

      for (const characterKey of Object.keys(characterProfiles)) {
        const character = characterProfiles[characterKey];

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: character.personality },
            {
              role: 'user',
              content: `A new Cyber Times article just dropped titled: "${article.title}". Here's the summary: ${article.summary}. What would you post on PunkX? Respond with one short, punchy, in-character social media post. Do not explain. No hashtags unless relevant.`
            }
          ],
          temperature: 0.9,
          max_tokens: 100
        });

        const text = completion.choices[0].message.content;

        results.push({
          author: characterKey.charAt(0).toUpperCase() + characterKey.slice(1),
          text: text.trim(),
          linkedArticleId: article.id,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({ posts: results });
    }

    return res.status(400).json({ message: 'Invalid request payload' });
  } catch (error) {
    console.error('🔥 Reaction generation error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
