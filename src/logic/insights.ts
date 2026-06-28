import { UserProfile } from '../types/profile';

export interface Insight {
  id: string;
  category: 'self' | 'relationships' | 'communication' | 'work' | 'growth';
  icon: string;
  title: string;
  body: string;
}

// Keyed by archetype/type key → array of insights
const PERSONALITY_INSIGHTS: Record<string, Insight[]> = {
  ReflectiveExplorer: [
    {
      id: 'pe_1', category: 'self', icon: 'telescope-outline',
      title: 'You process internally first',
      body: 'You often have clear views on things before anyone knows you\'ve formed them. Your thinking happens quietly — and that is a strength, not a delay.',
    },
    {
      id: 'pe_2', category: 'relationships', icon: 'people-outline',
      title: 'Others may want more from you earlier',
      body: 'People close to you may occasionally feel they can\'t tell where you are. Sharing a partial thought before it\'s complete tends to build more connection than waiting for the finished version.',
    },
    {
      id: 'pe_3', category: 'work', icon: 'layers-outline',
      title: 'You do your best work with depth',
      body: 'Tasks that let you go into something fully are where you produce your best output. Shallow, rapid-fire tasks tend to frustrate you more than they frustrate others.',
    },
  ],
  CalmStrategist: [
    {
      id: 'cs_1', category: 'work', icon: 'checkmark-done-outline',
      title: 'Your reliability is a competitive advantage',
      body: 'In most contexts, doing what you say you\'ll do is rarer than it sounds. It is a form of influence that compounds quietly over years.',
    },
    {
      id: 'cs_2', category: 'growth', icon: 'shuffle-outline',
      title: 'Unplanned situations aren\'t threats',
      body: 'When things shift unexpectedly, notice whether your discomfort is about the outcome — or just the loss of structure. Often it\'s the latter, and knowing that gives you more options.',
    },
    {
      id: 'cs_3', category: 'relationships', icon: 'hourglass-outline',
      title: 'You show care through consistency',
      body: 'You are not always the most verbally expressive person in the room — but the people who know you trust you precisely because you do not promise what you cannot deliver.',
    },
  ],
  WarmConnector: [
    {
      id: 'wc_1', category: 'relationships', icon: 'heart-outline',
      title: 'You track relationships in the background',
      body: 'You likely remember small things about people — what was worrying them last month, the tone shift in a recent conversation. This attentiveness is rare and noticed.',
    },
    {
      id: 'wc_2', category: 'growth', icon: 'hand-right-outline',
      title: 'Your needs count too',
      body: 'You give generously and often. The practice of naming what you need — directly, without wrapping it in care for others first — is available to you.',
    },
    {
      id: 'wc_3', category: 'work', icon: 'people-circle-outline',
      title: 'You are better in collaborative settings',
      body: 'Isolation tends to drain your energy faster than it does for others. Environments where your warmth can operate freely are where you produce your best work.',
    },
  ],
  SensitiveVisionary: [
    {
      id: 'sv_1', category: 'self', icon: 'flash-outline',
      title: 'Your intuitions are often right',
      body: 'You sense the direction of something before the data confirms it. In environments that reward explicit reasoning, this can feel like a liability. It is not.',
    },
    {
      id: 'sv_2', category: 'growth', icon: 'trending-up-outline',
      title: 'Build a faster path from reaction to perspective',
      body: 'Criticism, uncertainty, or a difficult tone can land harder for you than for others. The distance between stimulus and interpretation is a learnable skill.',
    },
    {
      id: 'sv_3', category: 'communication', icon: 'megaphone-outline',
      title: 'You have stronger opinions than you voice',
      body: 'Your internal assessments are often precise and well-founded. Expressing them with less editing tends to produce better outcomes than waiting for certainty.',
    },
  ],
  ExpressiveIdealist: [
    {
      id: 'ei_1', category: 'relationships', icon: 'globe-outline',
      title: 'You bridge different kinds of people',
      body: 'You connect comfortably across personality types and social contexts. This is rarer than it looks and it creates real value in teams and relationships.',
    },
    {
      id: 'ei_2', category: 'growth', icon: 'flag-outline',
      title: 'Starting is easier than sustaining',
      body: 'Your energy peaks at the beginning of something new. Building habits and systems that carry you through the less exciting phases is your highest-leverage growth area.',
    },
    {
      id: 'ei_3', category: 'work', icon: 'rocket-outline',
      title: 'You generate momentum',
      body: 'You are often the reason something begins — the energy that initiates a conversation, project, or collaboration. That initiation matters more than you credit it for.',
    },
  ],
  CuriousArchitect: [
    {
      id: 'ca_1', category: 'self', icon: 'construct-outline',
      title: 'You think in frameworks',
      body: 'Before acting, you build a model of how things fit together. This produces unusually thorough decisions — at the cost of sometimes delaying them longer than necessary.',
    },
    {
      id: 'ca_2', category: 'communication', icon: 'git-merge-outline',
      title: 'Translation is a skill worth developing',
      body: 'What feels obvious inside your framework can be completely invisible to others. Sharing the scaffold of your thinking — not just the conclusion — is where your influence grows.',
    },
    {
      id: 'ca_3', category: 'work', icon: 'library-outline',
      title: 'You learn across domains deliberately',
      body: 'Your range is unusual. Ideas from one field consistently inform how you approach another. This synthesis is one of your most distinctively useful traits.',
    },
  ],
  GroundedHarmonizer: [
    {
      id: 'gh_1', category: 'relationships', icon: 'leaf-outline',
      title: 'You are a regulating presence',
      body: 'When tension rises in a room or relationship, you tend to absorb and settle it. People may not always name this — but they feel it and rely on it.',
    },
    {
      id: 'gh_2', category: 'growth', icon: 'warning-outline',
      title: 'Some tensions need to stay open',
      body: 'Your instinct toward harmony occasionally means smoothing something before it has been fully said. Not all discomfort needs resolving — some of it is the conversation still happening.',
    },
    {
      id: 'gh_3', category: 'work', icon: 'checkmark-circle-outline',
      title: 'You finish what others start',
      body: 'Ideas into completed things — that gap is where many people lose energy. You tend not to. This is practically valuable in almost every context.',
    },
  ],
  PrivateAnalyst: [
    {
      id: 'pa_1', category: 'self', icon: 'search-outline',
      title: 'You form assessments quietly',
      body: 'You rarely commit to a view fast. You observe, update, and then — occasionally — share. People sometimes misjudge where you stand because this process is invisible.',
    },
    {
      id: 'pa_2', category: 'relationships', icon: 'key-outline',
      title: 'Trust, once extended, is substantial',
      body: 'Your reserve at the surface is not the full story. The people who earn your full trust often describe it as one of the most valuable things they have.',
    },
    {
      id: 'pa_3', category: 'growth', icon: 'eye-outline',
      title: 'Visibility is a learnable habit',
      body: 'The gap between your inner world and what people can see is wider than you may realize. Small, selective signals of engagement change the relational equation significantly.',
    },
  ],
};

const RELATIONSHIP_INSIGHTS: Record<string, Insight[]> = {
  Secure: [
    {
      id: 'sec_1', category: 'relationships', icon: 'expand-outline',
      title: 'You can hold closeness and space simultaneously',
      body: 'When someone needs distance, you can usually give it without assuming the worst. This is a significant relational skill that many people spend years developing.',
    },
    {
      id: 'sec_2', category: 'growth', icon: 'people-outline',
      title: 'Others may not share your ease with closeness',
      body: 'What feels natural to you can feel genuinely risky for someone with a different relational history. Meeting people where they are — not where you expect them to be — is the growth edge.',
    },
  ],
  Anxious: [
    {
      id: 'anx_1', category: 'relationships', icon: 'infinite-outline',
      title: 'You love deeply and consistently',
      body: 'When you are in — a friendship, a relationship — you are genuinely in. Your investment is real, and the people who receive it are fortunate.',
    },
    {
      id: 'anx_2', category: 'growth', icon: 'heart-outline',
      title: 'Safety rarely comes from reassurance alone',
      body: 'The urge to check in, seek confirmation, or replay the conversation is an attempt to reach safety. Building steadiness from within — rather than from external signals — is the more durable path.',
    },
  ],
  Avoidant: [
    {
      id: 'avo_1', category: 'self', icon: 'person-outline',
      title: 'Your independence is a genuine strength',
      body: 'You handle difficulty alone, regulate yourself well, and rarely require external validation to function. This is real competence, not just a coping mechanism.',
    },
    {
      id: 'avo_2', category: 'relationships', icon: 'close-circle-outline',
      title: 'Withdrawal can land harder than you intend',
      body: 'When you pull back during high-demand moments, others may interpret it as rejection. Naming that you need space — even briefly — changes how it lands significantly.',
    },
  ],
  FearfulAvoidant: [
    {
      id: 'fa_1', category: 'self', icon: 'git-pull-request-outline',
      title: 'Wanting closeness and pulling back are both real',
      body: 'The push-pull you feel is not confusion — it is a coherent response to a relational history where intimacy was not reliably safe. This pattern is more common than most people realize.',
    },
    {
      id: 'fa_2', category: 'relationships', icon: 'shield-half-outline',
      title: 'Trust builds through consistent small evidence',
      body: 'You are not uniformly closed — you can be warm and deeply engaged in the right conditions. Those conditions build through accumulated evidence, not grand gestures.',
    },
  ],
};

const COMMUNICATION_INSIGHTS: Record<string, Insight[]> = {
  DirectHarmonizer: [
    {
      id: 'dh_1', category: 'communication', icon: 'arrow-forward-circle-outline',
      title: 'You move toward resolution',
      body: 'Unresolved tension frustrates you because you prefer clarity to ambiguity. When conflict is treated as a shared problem rather than a personal battle, you are at your best.',
    },
  ],
  ReflectiveProcessor: [
    {
      id: 'rp_1', category: 'communication', icon: 'pause-outline',
      title: 'Signal where you are, even briefly',
      body: 'Others may interpret your silence as disengagement. "I need a day to think about this" prevents significant misreading of your actual engagement.',
    },
  ],
  CalmStrategist: [
    {
      id: 'cst_1', category: 'communication', icon: 'thermometer-outline',
      title: 'People need to feel heard before they can hear solutions',
      body: 'Your analytical instinct is to solve. But for many people, the emotional step is not inefficiency — it is the prerequisite to productive problem-solving.',
    },
  ],
  ExpressiveConnector: [
    {
      id: 'ec_1', category: 'communication', icon: 'book-outline',
      title: 'Your full honesty is often what deepens connection',
      body: 'Your preference for harmony sometimes leads you to soften your message until it loses its edge. The people who matter to you often want your real perspective more than your managed one.',
    },
  ],
  IndependentProtector: [
    {
      id: 'ip_1', category: 'communication', icon: 'key-outline',
      title: 'Small signals of engagement close large gaps',
      body: 'The distance between your internal experience and what you show is wider than you realize. Selective, brief disclosure — particularly during moments that matter — changes how people experience you.',
    },
  ],
};

const TYPE_INSIGHTS: Record<string, Insight[]> = {
  INTJ: [
    { id: 'intj_1', category: 'self', icon: 'telescope-outline', title: 'You process before you reveal', body: 'Your thinking is usually more complete than others realize. The gap between your internal clarity and your external communication is worth closing — not always, but when it matters.' },
    { id: 'intj_2', category: 'work', icon: 'layers-outline', title: 'You need work that challenges your ceiling', body: 'Unchallenging work doesn\'t just bore you — it drains you. Finding the edge of what you know is where you function best.' },
    { id: 'intj_3', category: 'relationships', icon: 'people-outline', title: 'Your directness is honest, but land-sensitive', body: 'You mean what you say. Not everyone hears it the way you intend. A beat of context before the conclusion makes a significant difference.' },
  ],
  INTP: [
    { id: 'intp_1', category: 'self', icon: 'git-branch-outline', title: 'Certainty is not your natural state', body: 'You explore possibility before committing to a conclusion. This produces real insight — and occasionally delays action longer than necessary.' },
    { id: 'intp_2', category: 'work', icon: 'flask-outline', title: 'You do your best thinking when the problem is open', body: 'Closed questions bore you. The interesting part is the model, not the answer — which is worth knowing about yourself.' },
    { id: 'intp_3', category: 'growth', icon: 'checkmark-outline', title: 'Finishing is its own skill', body: 'Shipping something imperfect is harder for you than for most. Separating "good enough to share" from "fully resolved" is a practice worth building.' },
  ],
  ENTJ: [
    { id: 'entj_1', category: 'work', icon: 'trending-up-outline', title: 'You think in outcomes naturally', body: 'Most people have to remind themselves to track toward a goal. For you it\'s the default. The risk is impatience with people who don\'t operate the same way.' },
    { id: 'entj_2', category: 'relationships', icon: 'ear-outline', title: 'Listening is a strategic act', body: 'You already know what you think. The information you\'re missing is what others see that you haven\'t. Slowing down to gather it is not weakness — it\'s better data.' },
    { id: 'entj_3', category: 'growth', icon: 'pause-outline', title: 'Pause is information', body: 'Your instinct is to move fast. Sometimes the best move is to wait until more is known. Distinguishing those moments is the leverage point.' },
  ],
  ENTP: [
    { id: 'entp_1', category: 'self', icon: 'bulb-outline', title: 'You generate ideas faster than you execute them', body: 'This is not a flaw — it\'s a feature that needs pairing. Find the people who love to build what you imagine.' },
    { id: 'entp_2', category: 'work', icon: 'infinite-outline', title: 'Novelty is fuel, not distraction', body: 'You lose energy when things become routine. Building variety into your work structure is not indulgence — it\'s maintenance.' },
    { id: 'entp_3', category: 'growth', icon: 'flag-outline', title: 'Commitment is also a form of freedom', body: 'Keeping options open indefinitely eventually closes the bigger option. Choosing a direction is how you find out what you\'re actually capable of.' },
  ],
  INFJ: [
    { id: 'infj_1', category: 'self', icon: 'eye-outline', title: 'You read the room without trying', body: 'You pick up on things others haven\'t said yet. This is a real perceptual advantage — and occasionally exhausting to carry.' },
    { id: 'infj_2', category: 'growth', icon: 'share-outline', title: 'Your thinking has value before it\'s finished', body: 'The internal standard you hold for when something is ready to share is often higher than it needs to be. Earlier is fine.' },
    { id: 'infj_3', category: 'relationships', icon: 'heart-outline', title: 'You give a lot. Ask for what you need.', body: 'You tend to attune to others\' needs before your own. Naming what you need — directly, early — is available to you.' },
  ],
  INFP: [
    { id: 'infp_1', category: 'self', icon: 'leaf-outline', title: 'Your values are not optional', body: 'You\'re not being difficult when something conflicts with what you believe. That conflict is real data, not noise.' },
    { id: 'infp_2', category: 'work', icon: 'heart-outline', title: 'Purpose is the fuel', body: 'Meaningless work doesn\'t just bore you — it quietly drains you. This is worth designing around, not through.' },
    { id: 'infp_3', category: 'growth', icon: 'shield-outline', title: 'Feedback is not a verdict on you', body: 'When feedback touches something identity-adjacent, it can land harder than intended. Separating the work from who you are is a practice worth building.' },
  ],
  ENFJ: [
    { id: 'enfj_1', category: 'relationships', icon: 'people-outline', title: 'You carry the room\'s emotional weight', body: 'Being aware of how everyone is doing is a gift — and a cost. Knowing when to put it down is part of sustaining it.' },
    { id: 'enfj_2', category: 'growth', icon: 'hand-right-outline', title: 'Your needs count too', body: 'You give generously and consistently. The practice of naming what you need — before you\'re already depleted — is available to you.' },
    { id: 'enfj_3', category: 'work', icon: 'sunny-outline', title: 'You help people grow', body: 'You see potential in others often before they do. This is a rare and significant gift when pointed in the right direction.' },
  ],
  ENFP: [
    { id: 'enfp_1', category: 'self', icon: 'star-outline', title: 'You see potential everywhere', body: 'This is your greatest asset — and occasionally a trap. Not every possibility deserves a full investment. Choosing which ones to chase is a skill.' },
    { id: 'enfp_2', category: 'work', icon: 'flash-outline', title: 'Your enthusiasm opens doors', body: 'When you\'re energized about something, others feel it. This is a real form of leadership that doesn\'t require a title.' },
    { id: 'enfp_3', category: 'growth', icon: 'flag-outline', title: 'Commitment deepens experience', body: 'Staying with something past the initial excitement reveals a different kind of reward. The depth is on the other side of the novelty.' },
  ],
  ISTJ: [
    { id: 'istj_1', category: 'work', icon: 'checkmark-done-outline', title: 'Your reliability compounds over time', body: 'Trust is built incrementally, through consistent follow-through. You do this naturally — and it pays long-term dividends.' },
    { id: 'istj_2', category: 'growth', icon: 'shuffle-outline', title: 'Flexibility is also a skill', body: 'When the situation genuinely changes, adapting the approach is not inconsistency — it\'s judgment. The goal stays; the path adjusts.' },
    { id: 'istj_3', category: 'relationships', icon: 'hourglass-outline', title: 'You show care through consistency', body: 'You\'re not always the most verbally expressive — but the people who know you trust you precisely because you do what you say.' },
  ],
  ISFJ: [
    { id: 'isfj_1', category: 'relationships', icon: 'home-outline', title: 'You stabilize without announcement', body: 'Things run more smoothly when you\'re around. This often goes unacknowledged — which is worth noticing, even if you don\'t need the credit.' },
    { id: 'isfj_2', category: 'growth', icon: 'hand-right-outline', title: 'Say what you need before you\'re depleted', body: 'Your threshold for asking is high. The cost tends to accumulate quietly until it\'s significant. Earlier is better.' },
    { id: 'isfj_3', category: 'work', icon: 'shield-checkmark-outline', title: 'Your attention to detail is a real asset', body: 'The things you track that others miss are often what prevent problems downstream. This is quietly valuable work.' },
  ],
  ESTJ: [
    { id: 'estj_1', category: 'work', icon: 'grid-outline', title: 'You create structure others rely on', body: 'In ambiguous situations, people look to you. Your ability to impose order on confusion quickly is genuinely useful.' },
    { id: 'estj_2', category: 'growth', icon: 'swap-horizontal-outline', title: 'Some rules exist for reasons worth checking', body: 'The procedure may have been right when it was built and wrong now. Asking whether it still fits is not rebellion — it\'s judgment.' },
    { id: 'estj_3', category: 'relationships', icon: 'podium-outline', title: 'Your directness is respected and felt', body: 'People know where they stand with you. That clarity is valued — and benefits from occasional softening when the context is personal.' },
  ],
  ESFJ: [
    { id: 'esfj_1', category: 'relationships', icon: 'people-circle-outline', title: 'You tend to the group naturally', body: 'You notice who is struggling, what is unspoken, what the room needs. This attentiveness keeps things functioning.' },
    { id: 'esfj_2', category: 'growth', icon: 'chatbubble-outline', title: 'Honesty is also a form of care', body: 'Protecting harmony at the cost of truth eventually costs more. The honest thing, said well, is usually what actually helps.' },
    { id: 'esfj_3', category: 'work', icon: 'calendar-outline', title: 'You make coordination happen', body: 'Follow-up, logistics, tracking what was agreed — you manage these reliably and often without recognition. That\'s a real organizational asset.' },
  ],
  ISTP: [
    { id: 'istp_1', category: 'work', icon: 'construct-outline', title: 'You learn best by doing', body: 'Direct engagement with a problem tells you more than any explanation. You figure out how things work by working with them.' },
    { id: 'istp_2', category: 'self', icon: 'flash-outline', title: 'Calm under pressure is a real asset', body: 'When things go wrong, you shift into problem-solving mode quickly. The emotional noise doesn\'t distract you from what needs fixing.' },
    { id: 'istp_3', category: 'relationships', icon: 'radio-outline', title: 'Others may not know what you\'re working on', body: 'You communicate your process less than others expect. A brief update — not full transparency, just a signal — tends to reduce friction significantly.' },
  ],
  ISFP: [
    { id: 'isfp_1', category: 'self', icon: 'ear-outline', title: 'You absorb atmosphere', body: 'You\'re sensitive to the emotional quality of spaces and people in a way that is unusually perceptive. This is information — trust it.' },
    { id: 'isfp_2', category: 'growth', icon: 'megaphone-outline', title: 'Speaking up earlier costs less than staying silent', body: 'When something conflicts with your values, the longer it builds quietly, the more it costs. Earlier is usually better — for everyone.' },
    { id: 'isfp_3', category: 'work', icon: 'color-palette-outline', title: 'Your best work responds to what\'s real', body: 'Abstract planning is less interesting to you than what\'s actually in front of you. Your situational thinking is a genuine strength.' },
  ],
  ESTP: [
    { id: 'estp_1', category: 'work', icon: 'walk-outline', title: 'You get information by moving', body: 'Analysis before action feels slow to you for good reason — your best data comes from doing, not theorizing.' },
    { id: 'estp_2', category: 'growth', icon: 'search-outline', title: 'Systems have context you haven\'t seen yet', body: 'Moving fast is valuable. Occasionally slowing to understand why a thing works before changing it protects you from the second-order costs.' },
    { id: 'estp_3', category: 'relationships', icon: 'pulse-outline', title: 'Your energy raises the tempo', body: 'Conversations get more direct and momentum builds when you\'re engaged. This is a form of leadership that doesn\'t require patience.' },
  ],
  ESFP: [
    { id: 'esfp_1', category: 'relationships', icon: 'sparkles-outline', title: 'You make ordinary moments better', body: 'You have a gift for lifting the energy in a room and finding what\'s alive in a situation. This is a real form of generosity.' },
    { id: 'esfp_2', category: 'growth', icon: 'today-outline', title: 'Future-you will benefit from present-you\'s structure', body: 'Preparation isn\'t your natural mode. Building in just enough structure to protect your future options — without killing the spontaneity — is worth the investment.' },
    { id: 'esfp_3', category: 'work', icon: 'people-outline', title: 'You connect people quickly', body: 'You are genuinely curious about others and it shows immediately. People open up around you faster than usual. This is rare and useful.' },
  ],
};

export function getInsightsForProfile(profile: UserProfile): Insight[] {
  const insights: Insight[] = [];

  const personalityKey = profile.assessmentResults.personality?.archetype;
  const relationshipKey = profile.assessmentResults.relationship?.archetype;
  const communicationKey = profile.assessmentResults.communication?.archetype;

  if (personalityKey && PERSONALITY_INSIGHTS[personalityKey]) {
    insights.push(...PERSONALITY_INSIGHTS[personalityKey]);
  }
  if (relationshipKey && RELATIONSHIP_INSIGHTS[relationshipKey]) {
    insights.push(...RELATIONSHIP_INSIGHTS[relationshipKey]);
  }
  if (communicationKey && COMMUNICATION_INSIGHTS[communicationKey]) {
    insights.push(...COMMUNICATION_INSIGHTS[communicationKey]);
  }

  return insights;
}

export function getFirstInsight(profile: UserProfile): Insight | null {
  const typeResult = profile.assessmentResults.type;
  if (typeResult) {
    const typeInsights = TYPE_INSIGHTS[typeResult.primaryType];
    if (typeInsights && typeInsights.length > 0) return typeInsights[0];
  }

  const insights = getInsightsForProfile(profile);
  return insights.length > 0 ? insights[0] : null;
}
