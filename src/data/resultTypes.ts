// ─── Personality archetypes ───────────────────────────────────────────────────

export interface PersonalityArchetype {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  patterns: { icon: string; title: string; body: string }[];
  strengths: string[];
  blindSpot: string;
  stressPattern: string;
  workStyle: string;
  growthGuidance: string;
}

export const PERSONALITY_ARCHETYPES: PersonalityArchetype[] = [
  {
    key: 'ReflectiveExplorer',
    label: 'Reflective Explorer',
    tagline: 'Depth-seeking, internally rich, pattern-aware',
    chips: ['Processes before responding', 'Drawn to depth over breadth', 'Notices what others miss'],
    description:
      'You are most engaged when a conversation, project, or situation has depth — layers worth exploring. Surface-level environments drain you faster than you might admit. You tend to observe before speaking and your first impressions of people are often more accurate than they appear.',
    patterns: [
      {
        icon: 'telescope-outline',
        title: 'You think in systems',
        body: 'You do not just absorb information — you connect it. A fact is most interesting when it relates to something else. This makes you a natural pattern-finder, though others may not always follow your logic at first.',
      },
      {
        icon: 'hourglass-outline',
        title: 'You need processing time',
        body: 'You may lose interest in a conversation that moves faster than your ability to process it meaningfully. This is not slowness — it is how you produce your best thinking. The quality of what you say is usually worth the delay.',
      },
      {
        icon: 'eye-outline',
        title: 'You are more observant than you let on',
        body: 'You notice small shifts in energy, inconsistency in people, and subtext in conversations. You rarely comment on all of it. This perceptiveness is one of your quietest strengths.',
      },
    ],
    strengths: ['Deep curiosity', 'Original thinking', 'Quiet perceptiveness'],
    blindSpot:
      'Others may sometimes mistake your internal processing for distance or unavailability. You may be fully present and simply not showing it. Sharing your thinking earlier than feels ready can prevent unnecessary disconnection.',
    stressPattern: 'Under stress, you tend to withdraw into internal processing before you can engage outwardly. The withdrawal can look like distance or detachment to others, even when you are actually working through something important. Stimulating environments or emotional pressure without adequate processing time deplete you faster than most things.',
    workStyle: 'You work best with intellectual freedom, uninterrupted focus, and work that rewards depth over speed. Environments that require constant social interaction or fast surface-level output are draining. You produce your best thinking in quiet, with time to follow a problem where it leads.',
    growthGuidance: 'The most useful development for you is learning to surface your thinking before it feels complete. This is uncomfortable — but it creates connection, invites collaboration, and often produces better outcomes than finishing alone and presenting. Start with one trusted person.',
  },
  {
    key: 'CalmStrategist',
    label: 'Calm Strategist',
    tagline: 'Structured, deliberate, composed under pressure',
    chips: ['Plans before acting', 'Stays calm when others escalate', 'High follow-through'],
    description:
      'You approach most situations with a quiet structure that others find stabilizing. You tend to plan, follow through, and hold yourself to a consistent standard — even when no one is watching. In uncertain moments, you are often the person who becomes more focused, not less.',
    patterns: [
      {
        icon: 'calendar-outline',
        title: 'You plan to feel free',
        body: 'Structure is not rigidity for you — it is what allows you to act without anxiety. When things are organized, you have more capacity to be spontaneous and generous with others. Chaos does not free you; it constrains you.',
      },
      {
        icon: 'shield-outline',
        title: 'You are reliable in ways you do not advertise',
        body: 'People who know you well often describe you as someone who does what they say they will. This is one of the most undervalued traits in relationships and work, and it is genuinely yours.',
      },
      {
        icon: 'analytics-outline',
        title: 'You assess before you commit',
        body: 'You rarely act on impulse. This means you sometimes miss opportunities others jump at — but you also rarely regret decisions the way some people do. Your considered pace is a feature, not a limitation.',
      },
    ],
    strengths: ['Reliability', 'Focused execution', 'Emotional steadiness'],
    blindSpot:
      'Your preference for structure can sometimes translate into resistance when plans shift unexpectedly. Improvisation is not a threat to your competence — it is a different skill, and one worth developing alongside your natural strengths.',
    stressPattern: 'Stress tends to show up as increased rigidity — a tightening of the plan when the situation is actually calling for flexibility. You may find yourself holding to a structure that is no longer serving the goal, because certainty is more comfortable than improvisation under pressure.',
    workStyle: 'You work best with clear goals, defined processes, and the opportunity to plan properly before acting. Environments that reward consistent execution over dramatic output suit you. You are reliable across time — which means roles where long-term follow-through is valued are where you contribute most.',
    growthGuidance: 'Your next area of development is learning to read when the plan has outlived its usefulness. Not every shift in circumstances is a problem to solve — some are invitations to adapt. Holding your standards while staying genuinely curious about whether the approach still fits is a high-skill state.',
  },
  {
    key: 'WarmConnector',
    label: 'Steady Connector',
    tagline: 'Relational, attuned, quietly generous',
    chips: ['Remembers what matters to people', 'Reads the room naturally', 'Builds trust steadily'],
    description:
      'You are highly attuned to what people need and tend to adjust yourself accordingly — often without being asked. This is not people-pleasing; it is genuine responsiveness. You are at your best in environments where warmth and reliability are both valued.',
    patterns: [
      {
        icon: 'people-outline',
        title: 'You track relationships in the background',
        body: 'You tend to remember what people said weeks ago, notice when someone seems off, and register when a dynamic between two people has shifted. Most people do not do this consciously. You do, almost automatically.',
      },
      {
        icon: 'heart-outline',
        title: 'You feel other people\'s states',
        body: 'When someone in the room is struggling, you know before they say so. This attunement is a genuine gift, but it can also mean absorbing the emotional weight of others without realizing it.',
      },
      {
        icon: 'handshake-outline',
        title: 'You invest in people over time',
        body: 'You are not necessarily the most dazzling person in the room — you are often the most trusted. Your warmth is consistent rather than performative, and that consistency is rarer than you might think.',
      },
    ],
    strengths: ['Emotional attunement', 'Building trust', 'Collaborative ease'],
    blindSpot:
      'You may find it genuinely harder to advocate for your own needs than for others. Naming what you want directly can feel uncomfortable — almost selfish. It is not. Your generosity is more sustainable when it also includes yourself.',
    stressPattern: 'Under stress, you tend to absorb others\' emotions while managing your own privately. You may find yourself working to stabilise the people around you when you are the one who actually needs support. The cost of this becomes visible after the fact, not during.',
    workStyle: 'You work best in environments that value both relationship quality and practical contribution. Collaborative work energises you when it is genuine rather than performative. You are often a de facto coordinator of human dynamics even without the formal role.',
    growthGuidance: 'Advocating for your own needs with the same directness you bring to others is the work. Not because you are not doing enough — but because your sustainability depends on it. The people who care about you cannot help unless they can see what is actually needed.',
  },
  {
    key: 'SensitiveVisionary',
    label: 'Intuitive Strategist',
    tagline: 'Pattern-aware, emotionally intelligent, quietly driven',
    chips: ['Sees connection where others see facts', 'Feels the mood of a room', 'Has opinions they do not always voice'],
    description:
      'You tend to understand situations through feeling and intuition as much as through analysis. You are often right about things before you can fully explain why. This gives you an unusual combination: emotional intelligence and quiet strategic awareness, operating simultaneously.',
    patterns: [
      {
        icon: 'flash-outline',
        title: 'Your intuitions tend to land',
        body: 'You frequently sense the right approach before you have the data to justify it. In environments that reward explicit reasoning, this can feel like a disadvantage. It is not — it is a different kind of intelligence, and a valuable one.',
      },
      {
        icon: 'musical-notes-outline',
        title: 'You are responsive to atmosphere',
        body: 'The emotional temperature of a room affects you more than it does most people. A tense meeting, a critical comment, a shift in someone\'s energy — you register these quickly. Managing your environment deliberately is not weakness; it is self-knowledge.',
      },
      {
        icon: 'bulb-outline',
        title: 'You have strong views that sometimes stay internal',
        body: 'You often form clear assessments of situations and people, but you do not always share them. Part of this is tact. Part of it is a preference for certainty before speaking. Both are real, and the proportion matters.',
      },
    ],
    strengths: ['Intuitive pattern recognition', 'Emotional intelligence', 'Strategic sensitivity'],
    blindSpot:
      'Your sensitivity to criticism and uncertainty is higher than average. A single pointed remark can occupy more mental space than the rest of a positive day. Developing a faster internal pathway from reaction to perspective is one of the highest-return investments available to you.',
    stressPattern: 'Stress tends to amplify your sensitivity to criticism and interpersonal signals. A critical comment or shift in someone\'s energy can occupy significant mental space, even when it is peripheral to what actually matters. Distinguishing important signals from noise is genuinely harder under pressure.',
    workStyle: 'You work best in environments that honour both intuition and quality — where your ability to read beneath the surface is valued rather than discounted. You produce strong outcomes in roles that require emotional intelligence and strategic perception simultaneously. High-noise, low-trust environments cost you significantly.',
    growthGuidance: 'Learning to voice your assessments before you have full certainty is both difficult and high-leverage for you. The intuitions you are not sharing are often more accurate than you give them credit for. Trusting them earlier — and testing them with people you respect — is where significant growth is available.',
  },
  {
    key: 'ExpressiveIdealist',
    label: 'Open Catalyst',
    tagline: 'Energetic, curious, socially alive',
    chips: ['Energized by new people and ideas', 'Creates momentum in groups', 'Connects across different worlds'],
    description:
      'You move through the world with an openness that draws others in. New people, new contexts, and new ideas genuinely interest you — and your enthusiasm is often what gets things started. You are at your best when there is movement, energy, and possibility in the air.',
    patterns: [
      {
        icon: 'rocket-outline',
        title: 'You are a natural initiator',
        body: 'Ideas, conversations, plans — you tend to be the one who starts them. Others often follow your energy without fully realizing it. This is a real form of influence, though it can sometimes leave you doing more initiation than follow-through.',
      },
      {
        icon: 'globe-outline',
        title: 'You bridge different kinds of people',
        body: 'You tend to find common ground across different backgrounds, personalities, and contexts. This is rarer than it sounds. Most people connect comfortably within a small range. You connect across a wide one.',
      },
      {
        icon: 'timer-outline',
        title: 'Your engagement is tied to novelty',
        body: 'You are most engaged when something feels fresh, meaningful, or surprising. When a situation becomes routine without variation, your interest can drop faster than you expect. Knowing this helps you design your life intentionally.',
      },
    ],
    strengths: ['Social momentum', 'Cross-context connection', 'Enthusiastic openness'],
    blindSpot:
      'Your energy and enthusiasm can sometimes outpace your depth of commitment. Beginning things is easy; sustaining them through the less exciting middle phases is where your real development work lies.',
    stressPattern: 'Under stress, your energy can escalate rather than diminish — leading to over-initiation, over-socialising, or optimism that outpaces the reality of a situation. You may generate momentum in a direction that needs a pause rather than more speed. Recognising this as a stress pattern, rather than your natural enthusiasm, gives you a useful pause point.',
    workStyle: 'You are most engaged in work that involves people, novelty, and the sense that something is being started. Routine and bureaucracy drain you. You are strongest in roles where your energy and openness to people generate genuine value — and where there is support or structure to ensure follow-through happens.',
    growthGuidance: 'Depth of commitment, sustained across time, is where the most significant growth is available to you. Beginning things comes naturally. Staying through the phases that are less exciting — and finding meaning in the consistency rather than the launch — will produce the outcomes your ambition is actually after.',
  },
  {
    key: 'CuriousArchitect',
    label: 'Curious Architect',
    tagline: 'Idea-driven, systems-oriented, quietly ambitious',
    chips: ['Builds frameworks to make sense of things', 'Interested in how things work', 'Independent in how they operate'],
    description:
      'You are not just interested in ideas — you are interested in what you can build with them. Exploration and execution are not opposites for you; they are two phases of the same drive. You are at your best when you have genuine intellectual freedom and a problem worth solving.',
    patterns: [
      {
        icon: 'construct-outline',
        title: 'You think in structures',
        body: 'Before you act, you tend to build a model — mental or literal — of how things fit together. This gives you unusual clarity in complex situations, though the model-building phase can sometimes delay action longer than necessary.',
      },
      {
        icon: 'library-outline',
        title: 'You learn across domains',
        body: 'You are unlikely to be satisfied with expertise in just one area. You pull threads from different fields and synthesize them. This makes you harder to categorize professionally, but it is also one of the things that makes your thinking genuinely original.',
      },
      {
        icon: 'trending-up-outline',
        title: 'You have a long time horizon',
        body: 'You tend to think in terms of years, not weeks. You are willing to invest significantly in something if you believe it will compound. This is rare — and can feel alienating in environments that optimize for short-term outcomes.',
      },
    ],
    strengths: ['Systems thinking', 'Intellectual range', 'Long-horizon planning'],
    blindSpot:
      'The gap between your internal clarity and your ability to communicate it can frustrate others. What feels obvious from inside your framework may be invisible to someone seeing only the output. Translating your thinking for others is a learnable skill — and a high-leverage one.',
    stressPattern: 'Under stress, you often disappear into thinking more than is useful — building elaborate frameworks for a situation that actually needs action. The analysis can feel productive while actually being avoidant. Time-bounding your thinking periods and committing to an output before the analysis feels complete is a useful friction.',
    workStyle: 'You work best with intellectual latitude, complex problems, and the ability to operate independently for extended periods. Environments that combine creative autonomy with real-world stakes are where you are most motivated. You need intellectual peers who can engage with the full range of what you are building.',
    growthGuidance: 'The gap between how clearly you see something internally and how effectively you communicate it externally is the most important gap to close. You have something worth communicating. The work is developing the translation — not as a concession to others, but as the last step in making your thinking actually useful.',
  },
  {
    key: 'GroundedHarmonizer',
    label: 'Grounded Harmonizer',
    tagline: 'Stable, dependable, quietly effective',
    chips: ['Keeps things moving without drama', 'Resolves tension before it escalates', 'Consistent over time'],
    description:
      'You offer something genuinely rare: steadiness under pressure and genuine care for the people around you, operating together. You do not tend to spike high or crash low. You are the person others stabilize around without always realizing it.',
    patterns: [
      {
        icon: 'leaf-outline',
        title: 'You are a regulating presence',
        body: 'In groups and relationships, you tend to absorb tension and restore equilibrium without making it dramatic. People often do not realize how much they rely on this until you are not there. It is a form of quiet leadership.',
      },
      {
        icon: 'checkmark-done-outline',
        title: 'You finish what others start',
        body: 'You are often the person who makes sure things actually happen. The gap between an idea and its execution is where many people lose energy. You do not. This is one of the most practically valuable traits in any team or relationship.',
      },
      {
        icon: 'compass-outline',
        title: 'You are consistent in your values',
        body: 'You tend to hold a clear internal sense of what matters and act in alignment with it across different contexts. This consistency is what makes people trust you — sometimes more than they trust people with more surface charisma.',
      },
    ],
    strengths: ['Emotional steadiness', 'Practical follow-through', 'Trustworthiness'],
    blindSpot:
      'Your preference for harmony can sometimes mean you defer resolution rather than pursue it. You may smooth over a conflict before both sides have fully said what they need to say. Some tensions need to be held open — not to create drama, but because the conversation is not actually finished.',
    stressPattern: 'Stress tends to push you toward over-accommodation — managing tensions and keeping the peace in ways that delay your own needs getting addressed. You may smooth things over before the underlying issue is fully resolved, which can lead to the same tension recurring.',
    workStyle: 'You work best in collaborative environments where reliability and consistency are genuinely valued. You are most effective when the work has human stakes and clear contribution. Your steady, follow-through nature makes you essential in any team that has the self-awareness to notice what you are actually doing.',
    growthGuidance: 'Holding tension open long enough for it to be resolved — rather than closing it for the sake of harmony — is the development work. Some conversations need to be uncomfortable to move. Your ability to stay warm while being honest is a rare combination. Using it on behalf of your own needs is the part that needs practice.',
  },
  {
    key: 'PrivateAnalyst',
    label: 'Private Analyst',
    tagline: 'Perceptive, precise, selectively open',
    chips: ['Observes before concluding', 'Prefers depth over breadth in relationships', 'Quality-oriented across the board'],
    description:
      'You see more than you show. Your observations about people and situations are often accurate and detailed, but you share them selectively — and only when trust is established. You value quality over quantity in almost everything: work, relationships, and conversation.',
    patterns: [
      {
        icon: 'search-outline',
        title: 'You form assessments quietly',
        body: 'You rarely commit to a position quickly. You observe, form an internal view, update it as new information arrives, and then — occasionally — share it. This process is invisible to others, which means they may misjudge where you actually stand.',
      },
      {
        icon: 'lock-closed-outline',
        title: 'You share selectively, not sparingly',
        body: 'What looks like reserve from the outside is often active discernment. You are not withholding — you are deciding. The people who receive your full trust often describe it as one of the most valuable things they have.',
      },
      {
        icon: 'ribbon-outline',
        title: 'You have high standards that you apply to yourself first',
        body: 'You tend to hold yourself to a rigorous internal standard before extending that standard outward. This produces real quality. It can also produce unnecessary self-criticism when the bar is set in a direction that does not serve you.',
      },
    ],
    strengths: ['Precise observation', 'High-quality output', 'Selective depth'],
    blindSpot:
      'The distance between your inner world and what others can see of you is wider than you realize. People who are not yet close to you may experience you as unavailable, even when you are paying close attention. Small signals of engagement — a question, a visible reaction — close that gap significantly.',
    stressPattern: 'Stress tends to intensify your withdrawal and self-criticism simultaneously. You may become more reserved externally while holding yourself to higher internal standards than the situation warrants. The gap between what others see and what is actually happening inside widens under pressure.',
    workStyle: 'You work best with meaningful problems, high standards, and significant autonomy. Environments that allow independent work with occasional collaboration suit you. The quality of your output tends to be high, and you are most valuable in roles where depth matters.',
    growthGuidance: 'Making yourself readable to people who have not yet earned your full trust is genuinely worth doing. Not because openness should be unconditional — but because the gap between your internal life and what others can see is wider than it serves you. Small, deliberate signals of engagement close it significantly.',
  },
];

// ─── Relationship pattern types ───────────────────────────────────────────────

export interface RelationshipType {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  patterns: { icon: string; title: string; body: string }[];
  connectionStyle: string;
  stressResponse: string;
  strengths: string[];
  blindSpot: string;
  gentleNote: string;
  closenessNeeds: string;
  growthGuidance: string;
}

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  {
    key: 'Secure',
    label: 'Open & Grounded',
    tagline: 'Comfortable with closeness, steady under uncertainty',
    chips: ['Can depend and be depended on', 'Gives space without anxiety', 'Expresses needs clearly'],
    description:
      'You tend to feel settled in close relationships without needing constant reassurance that things are okay. You can be close without losing yourself, and give others space without immediately assuming the worst. This is not an easy pattern to arrive at — it reflects real emotional experience.',
    patterns: [
      {
        icon: 'expand-outline',
        title: 'You can hold both closeness and space',
        body: 'When a partner or friend needs distance, you can usually extend it without interpreting it as rejection. This is a significant relational strength — the ability to be secure enough in a connection not to need it constantly confirmed.',
      },
      {
        icon: 'chatbubbles-outline',
        title: 'You ask for what you need directly',
        body: 'When something is bothering you, you tend to name it rather than wait for others to notice. This directness, when paired with warmth, is one of the most effective relationship skills there is.',
      },
      {
        icon: 'refresh-circle-outline',
        title: 'You recover from conflict relatively quickly',
        body: 'After a difficult conversation or a period of tension, you can usually return to equilibrium without carrying the residue for days. This makes you a stabilizing presence in relationships over time.',
      },
    ],
    connectionStyle:
      'You connect through genuine curiosity and availability. Closeness feels natural rather than risky, and you can be fully present without needing the other person to fill a particular role.',
    stressResponse:
      'Under stress, you may reach out for support or process things independently — often depending on the situation. You generally find your way back to equilibrium without extended distress.',
    strengths: ['Emotional availability', 'Direct self-expression', 'Relational resilience'],
    blindSpot:
      'You may occasionally underestimate how much uncertainty others bring to closeness. What feels easy and natural to you can feel genuinely risky for someone with a different relational history. Meeting people where they are — not where you expect them to be — is your growth edge.',
    gentleNote:
      'Security is not a permanent state. It is cultivated, and it can deepen through conscious relational practice and continued self-awareness.',
    closenessNeeds: 'You can hold closeness lightly — moving toward and away from it without the proximity itself becoming a source of anxiety. You need relationships where space is treated as neutral rather than significant. Too much pressure for constant emotional contact is tiring for you, even when the relationship is genuinely good.',
    growthGuidance: 'Your secure baseline is a real asset, but it can make it harder to stay patient with partners or friends whose attachment is less settled. The growth edge is not becoming less secure — it is deepening your understanding of what it costs someone else to get there, and adjusting your pace accordingly.',
  },
  {
    key: 'Anxious',
    label: 'Deeply Invested',
    tagline: 'Attuned, loyal, sensitive to relational signals',
    chips: ['Tracks relationship dynamics closely', 'Needs more reassurance than most', 'Invests deeply in people'],
    description:
      'You care deeply about the people in your life — sometimes more than feels comfortable to show. You are highly attuned to shifts in tone, availability, and engagement, which makes you perceptive and warm, but also more vulnerable to uncertainty. Reassurance is not weakness for you; it is how you regulate.',
    patterns: [
      {
        icon: 'wifi-outline',
        title: 'You read relational signals constantly',
        body: 'A slower-than-usual text reply, a slightly distracted tone, a missed plan — you register these and they carry weight. This sensitivity is also what makes you unusually aware of how people are really doing, not just how they present.',
      },
      {
        icon: 'infinite-outline',
        title: 'You replay conversations',
        body: 'When something felt emotionally unresolved, you are likely to return to it — mentally testing different interpretations, wondering what the other person meant. This is not rumination for its own sake; it is an attempt to get to safety. The exhausting part is that safety rarely comes from thinking alone.',
      },
      {
        icon: 'flame-outline',
        title: 'You love deeply and consistently',
        body: 'When you are in — in a friendship, a relationship, a commitment — you are genuinely in. Your investment is real, not performative. This depth of care is rare, and the people who receive it are fortunate.',
      },
    ],
    connectionStyle:
      'You connect through emotional intensity and consistent presence. When a relationship feels reciprocal and clear, you are one of the most generous and engaged people in it.',
    stressResponse:
      'Under relational stress, you may seek proximity and reassurance. If that is not available, you may find yourself amplifying small signals into larger concerns — or overanalyzing to find certainty where none exists yet.',
    strengths: ['Emotional depth', 'Relational attunement', 'Loyalty'],
    blindSpot:
      'The urgency you feel for connection can sometimes communicate itself as need, even when your intention is simply care. Building steadiness that comes from within — rather than from external confirmation — is the most durable version of the security you are seeking.',
    gentleNote:
      'Deep investment in people is not a flaw. It is a form of care. The work is learning how to hold it without it holding you.',
    closenessNeeds: 'You need relationships where the connection is visible enough to feel real. Regular contact, expressed investment, and honest communication about the state of the relationship help you feel settled. Ambiguity and distance without explanation are genuinely difficult — not because you are demanding, but because your attachment system registers uncertainty as a signal worth responding to.',
    growthGuidance: 'The most productive development work for this pattern is building your capacity to tolerate ambiguity without immediately seeking reassurance. This is not about needing less — it is about finding the pause between an anxious signal and your response to it. That pause is where you have the most freedom.',
  },
  {
    key: 'Avoidant',
    label: 'Private Stabilizer',
    tagline: 'Self-sufficient, boundaried, inward-processing',
    chips: ['Handles difficulty alone by default', 'Prefers space when overwhelmed', 'Builds trust through consistent action'],
    description:
      'You value your independence and tend to feel most capable on your own. You process emotion privately, rely on yourself for regulation, and often find high-intensity closeness more draining than fulfilling. This is not absence of feeling — it is a particular way of organizing yourself that developed for real reasons.',
    patterns: [
      {
        icon: 'person-outline',
        title: 'Your first instinct is to handle it yourself',
        body: 'When something goes wrong, reaching out for support is not your default. You tend to assess, process, and act — often without telling anyone. This competence is real. The cost is that others may feel excluded from a part of you that actually exists.',
      },
      {
        icon: 'close-circle-outline',
        title: 'Emotional intensity triggers distance',
        body: 'When a relationship becomes very emotionally demanding — lots of processing, lots of need, lots of urgency — you may find yourself pulling back. This is not cruelty; it is self-protection. But the withdrawal often lands harder than intended.',
      },
      {
        icon: 'time-outline',
        title: 'You trust actions over words',
        body: 'You are unlikely to trust someone based on what they say about themselves. You watch behavior over time — consistency, follow-through, how they behave when it costs them something. When someone earns your trust this way, it is substantial.',
      },
    ],
    connectionStyle:
      'You connect best with people who give you space and do not interpret quiet as distance. Trust is built through consistency over time, not through intensity of early disclosure.',
    stressResponse:
      'Under stress, you tend to withdraw and process privately. Asking for support does not come naturally, even when it would genuinely help.',
    strengths: ['Self-reliance', 'Emotional self-regulation', 'Consistent boundaries'],
    blindSpot:
      'People who care about you may not always know how to reach you. The gap between your internal experience and what you show externally can be wider than you realize — and wider than the people close to you can comfortably hold. Selective, intentional disclosure is a learnable skill, and it dramatically changes how people experience closeness with you.',
    gentleNote:
      'Your independence is a genuine strength. The question is whether it is a choice or a reflex — and you are the only one who can tell the difference.',
    closenessNeeds: 'You need more independence within a close relationship than most attachment patterns do. This is not about low investment — it is about the conditions under which you can invest without feeling overwhelmed. Relationships where you are given genuine space and are not required to process everything verbally are the ones where you show up most.',
    growthGuidance: 'Letting people in more, more often, before complete trust is established is the work. Not recklessly, but progressively. The people who matter most to you benefit more from your presence than from your protection. Small acts of deliberate openness, over time, tend to produce the quality of closeness that is actually worth the risk.',
  },
  {
    key: 'FearfulAvoidant',
    label: 'Cautiously Complex',
    tagline: 'Longing and self-protective at once',
    chips: ['Wants closeness but pulls back from it', 'High relational awareness', 'Cautious with trust'],
    description:
      'You experience something that many people do not have language for: you want deep connection, but closeness also carries a sense of risk. This is not confusion — it is a coherent internal response to a relational history where intimacy was not reliably safe. You are not broken. You are navigating a genuinely complex internal landscape.',
    patterns: [
      {
        icon: 'git-pull-request-outline',
        title: 'You cycle between closeness and distance',
        body: 'You may find yourself drawing people closer and then, when they actually arrive, feeling the urge to create space again. This rhythm makes sense from the inside. From the outside, it can register as inconsistency — which is worth being aware of.',
      },
      {
        icon: 'shield-half-outline',
        title: 'Your guard is context-sensitive',
        body: 'You are not uniformly closed — you can be warm, expressive, and deeply engaged in the right conditions. But those conditions involve a level of safety that takes time and evidence to establish. Rushing that process tends to produce the opposite of what you want.',
      },
      {
        icon: 'alert-circle-outline',
        title: 'You are highly attuned to signs of unsafety',
        body: 'Your nervous system is calibrated to notice inconsistency, ambiguity, or sudden shifts in how someone treats you. This vigilance served a purpose. It may now be slightly over-tuned, reading threat in situations that are genuinely neutral.',
      },
    ],
    connectionStyle:
      'You connect most deeply with people who earn trust gradually, demonstrate consistency, and do not require you to be more available than you currently are.',
    stressResponse:
      'Under stress, you may feel pulled in both directions simultaneously — wanting to reach out and wanting to disappear. Naming that experience, rather than acting from it immediately, tends to produce better outcomes.',
    strengths: ['Emotional complexity', 'Relational perceptiveness', 'Self-protective awareness'],
    blindSpot:
      'The internal push-pull that makes sense to you can register as confusing or even hurtful to people who care about you. Even brief communication during uncertain moments — just naming where you are — protects the relationships you value most.',
    gentleNote:
      'This pattern is more common than most people realize, and it is among the most responsive to self-awareness. Understanding it is the first meaningful step.',
    closenessNeeds: 'You need relationships with enough consistency and low-stakes contact to build safety incrementally. You can become genuinely close with people — but only through accumulated evidence of safety, not through leaps. Relationships that move fast toward high intimacy tend to trigger the part of you that protects itself, even when the other person has done nothing wrong.',
    growthGuidance: 'The pattern of wanting closeness and then moving away from it — or pushing people away just as it becomes real — is recognisable to you even when it is hard to stop in the moment. The most useful practice is not resisting the impulse entirely, but staying present in low-stakes moments of connection until the threat response softens. It does soften.',
  },
];

// ─── Communication style types ────────────────────────────────────────────────

export interface CommunicationStyleType {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  patterns: { icon: string; title: string; body: string }[];
  conflictPattern: string;
  bestEnvironment: string;
  strengths: string[];
  blindSpot: string;
  boundaryStyle: string;
  repairStyle: string;
  growthGuidance: string;
}

export const COMMUNICATION_TYPES: CommunicationStyleType[] = [
  {
    key: 'DirectHarmonizer',
    label: 'Direct Harmonizer',
    tagline: 'Honest, decisive, and group-aware',
    chips: ['Says what they mean', 'Resolves rather than avoids', 'Wants everyone heard'],
    description:
      'You say what you mean and you mean what you say — but you are not indifferent to how it lands. You want clarity AND cohesion, which means your directness is usually paired with a genuine effort to find common ground. You are frustrated by conversations that go nowhere and energized by ones that move.',
    patterns: [
      {
        icon: 'arrow-forward-circle-outline',
        title: 'You move toward resolution',
        body: 'When there is tension or disagreement, you generally want to address it rather than let it sit. You find unresolved conflict uncomfortable — not because you dislike difficulty, but because you prefer clarity to ambiguity.',
      },
      {
        icon: 'megaphone-outline',
        title: 'You say the thing',
        body: 'You are often the person in a group who names what everyone else is thinking but not saying. This can feel risky, and it can land awkwardly, but it is almost always useful. Environments that can handle honesty value this skill enormously.',
      },
      {
        icon: 'checkmark-circle-outline',
        title: 'Decisions feel like progress to you',
        body: 'Indecision and prolonged deliberation without movement are draining for you. You tend to feel better once something is decided, even if the decision requires trade-offs. The relief of a clear outcome outweighs the discomfort of choosing.',
      },
    ],
    conflictPattern:
      'You address disagreements head-on and push for resolution. Avoidance or circular conversations frustrate you. You are at your best when conflict is treated as a shared problem rather than a personal battle.',
    bestEnvironment:
      'You thrive where candor is expected, decisions are made clearly, and people follow through on what they say. Environments that reward ambiguity or indirect communication will consistently underuse you.',
    strengths: ['Clarity under pressure', 'Productive conflict navigation', 'Group decision-making'],
    blindSpot:
      'Your pace and directness can sometimes land as pressure — particularly for people who process more slowly or who need more emotional space before they can hear content. A brief pause before delivery does not compromise your honesty; it often makes it land better.',
    boundaryStyle: 'You tend to set limits clearly when they are crossed — though you usually extend significant goodwill before the limit is named. Your directness means limits are stated more explicitly than with most styles, which can feel blunt to people who communicate indirectly. You would rather clarify than manage a resentment.',
    repairStyle: 'After conflict, you tend to move toward resolution fairly quickly. Sitting in unresolved tension is uncomfortable. You are willing to say what needs to be said to close a rupture, and you expect others to meet you in that. Drawn-out repair processes test your patience.',
    growthGuidance: 'The place where the most development is available is in slowing down the drive to resolve — not to avoid resolution, but to ensure both people have fully had their say before you move on. Sometimes repair feels complete to you before it does to the other person.',
  },
  {
    key: 'ReflectiveProcessor',
    label: 'Reflective Processor',
    tagline: 'Thoughtful, deliberate, depth-oriented',
    chips: ['Thinks before speaking', 'Needs time after charged conversations', 'Listens more than they talk'],
    description:
      'You think before you speak — sometimes at significant length. This means your contributions are usually considered and precise. You may not be the first voice in a room, but when you do speak, it is usually worth stopping for. You work best when given room to process before being expected to respond.',
    patterns: [
      {
        icon: 'pause-outline',
        title: 'You need time between stimulus and response',
        body: 'A question asked in a meeting, a charged comment in a conversation, a complex email — you process these more thoroughly before responding than most people around you. This produces better answers. It can also produce the appearance of disengagement if you do not signal where you are.',
      },
      {
        icon: 'create-outline',
        title: 'You communicate best in writing',
        body: 'Given the choice, you often produce your clearest thinking in written form. Email, notes, or structured documents give you the space your verbal communication sometimes lacks. This is a genuine strength in environments that use written communication well.',
      },
      {
        icon: 'ear-outline',
        title: 'You are an unusually good listener',
        body: 'You are genuinely present when others are talking. You track what is being said, what is being implied, and what is being left out. People often feel heard by you — though you may not think of yourself as particularly communicative.',
      },
    ],
    conflictPattern:
      'You prefer to step back before responding to conflict. You may need time away from a charged conversation before you can engage with it constructively. This is not avoidance — it is how you produce your best response.',
    bestEnvironment:
      'You do your best work in environments that value depth over speed. Written communication, structured reflection, and conversations that go somewhere meaningful are where you naturally excel.',
    strengths: ['Thoughtful precision', 'Active listening', 'Written clarity'],
    blindSpot:
      'Others may interpret your silence as disengagement, coolness, or disapproval. Signaling where you are — even briefly — prevents significant misreading. A "I need a day to think about this" goes a long way.',
    boundaryStyle: 'You tend to set limits indirectly or very late — often after you have absorbed more than you needed to. You notice when something feels off long before you name it. The gap between noticing and saying is where the cost accumulates.',
    repairStyle: 'After conflict, you need time to process before you can re-engage. Being pushed toward repair before that has happened tends to produce surface agreement rather than genuine resolution. Given space, you tend to return to people fully — and more thoughtfully than most.',
    growthGuidance: 'Naming what you need, when you notice you need it — rather than waiting until the situation is clearer — is the development work. The wait is understandable. But by the time clarity arrives, others may have moved on or drawn the wrong conclusions.',
  },
  {
    key: 'CalmStrategist',
    label: 'Calm Strategist',
    tagline: 'Analytical, composed, solution-oriented',
    chips: ['Stays calm when others escalate', 'Separates emotion from problem', 'Finds the efficient path'],
    description:
      'You navigate communication like a strategist. When others escalate, you tend to become more focused. When a conversation gets emotional, you automatically start looking for the underlying problem. This composure is a genuine asset — and it comes with a specific blind spot worth knowing.',
    patterns: [
      {
        icon: 'stats-chart-outline',
        title: 'You separate the emotional from the practical',
        body: 'In a heated conversation, you tend to start analyzing: what is the actual issue, what are the options, what does each side actually need. This often gets you to resolution faster — but it can bypass a step others genuinely require.',
      },
      {
        icon: 'thermometer-outline',
        title: 'You are the calm in the room',
        body: 'When situations escalate around you, you often become more contained rather than more reactive. This is a form of leadership, whether or not it comes with a title. People in crisis tend to orient toward you without necessarily being aware that they are doing it.',
      },
      {
        icon: 'git-branch-outline',
        title: 'You see the cleaner path',
        body: 'In a complex disagreement, you often identify the most efficient resolution before others have finished expressing the problem. Waiting for the right moment to introduce it — rather than the earliest moment — tends to produce much better reception.',
      },
    ],
    conflictPattern:
      'You approach conflict analytically — separating the emotional from the practical and focusing on the cleanest solution. You may underestimate how much others need to feel heard before they can engage with solutions.',
    bestEnvironment:
      'You excel in high-stakes, complex environments where clear thinking under pressure is valued. Written communication, structured problem-solving, and evidence-based decision-making are natural modes for you.',
    strengths: ['Composure under pressure', 'Strategic problem-solving', 'Efficient communication'],
    blindSpot:
      'For many people, being heard emotionally is the prerequisite to being heard rationally. Trying to solve before acknowledging tends to extend the conflict, not shorten it. The emotional step is not inefficiency — it is the work.',
    boundaryStyle: 'You set limits through policy and principle rather than through emotional expression. You tend not to make it personal — you state the standard and hold to it. This works well in low-stakes contexts; in high-stakes personal ones, people sometimes need to feel the emotional weight behind the limit, not just the logic.',
    repairStyle: 'You approach repair practically and without drama. Once you have identified the problem, you propose a fix. The emotional residue of conflict is less important to you than whether the functional problem has been solved. Some people need more of the emotional piece before the practical is useful.',
    growthGuidance: 'Sitting with the relational texture of a conflict — the feelings, not just the facts — is the edge. Not because emotional processing is more valid than practical resolution, but because people sometimes need to be met in the feeling before they can receive the solution.',
  },
  {
    key: 'ExpressiveConnector',
    label: 'Expressive Connector',
    tagline: 'Warm, emotionally attuned, relationship-first',
    chips: ['Reads emotional tone naturally', 'Communicates through stories', 'Prioritizes connection'],
    description:
      'You communicate through connection. You read the emotional undercurrents of a conversation as automatically as other people follow the words. Your warmth and expressiveness create an environment where people feel safe being honest — and that is a more valuable skill than it sounds.',
    patterns: [
      {
        icon: 'radio-outline',
        title: 'You track emotional tone automatically',
        body: 'You notice when someone\'s tone shifts mid-sentence. You sense the difference between polite agreement and genuine alignment. You register when something feels off before it is named. This is not anxiety — it is a finely tuned form of social intelligence.',
      },
      {
        icon: 'book-outline',
        title: 'You communicate through narrative',
        body: 'When you want to explain how you feel or make a point, you often do it through a story or a personal example. This is not meandering — it is how you naturally build connection and make information emotionally accessible. Environments that want bullet points may undervalue this.',
      },
      {
        icon: 'link-outline',
        title: 'You prioritize the relationship',
        body: 'In a disagreement, you are more likely to be tracking what this means for the relationship than whether you are technically right. This is not weakness. It is a genuine insight that most conflicts are relational problems dressed up as content problems.',
      },
    ],
    conflictPattern:
      'You prioritize the relationship over the argument. You may find it hard to stay in conflict if it feels like it is damaging the connection. Your instinct is to repair — sometimes before the issue is fully spoken.',
    bestEnvironment:
      'You thrive in relational, collaborative environments where emotional intelligence is genuinely valued. Deep conversation energizes you; surface-level interaction can feel hollow quickly.',
    strengths: ['Emotional intelligence', 'Building trust quickly', 'Reading people accurately'],
    blindSpot:
      'Your preference for harmony can lead you to soften your message until it loses its edge. The people who matter to you often want your honest perspective more than your managed one. Saying the full thing, with care, is not the opposite of connection — it is often what deepens it.',
    boundaryStyle: 'You find it genuinely difficult to set limits when doing so risks the relationship. You may absorb more than is sustainable because you are unwilling to introduce friction. When limits do get set, they sometimes come out more sharply than intended — the result of long restraint rather than aggression.',
    repairStyle: 'You repair through warmth and re-connection rather than through explicit conversation about what went wrong. You tend to soften things with affection and check-in rather than revisit the conflict directly. This works in some relationships; in others, it can leave the underlying issue unaddressed.',
    growthGuidance: 'Learning to name a limit in the moment rather than after the resentment has built is the highest-leverage development available here. You can be warm and direct at the same time — the warmth does not require you to be silent about what you need.',
  },
  {
    key: 'IndependentProtector',
    label: 'Independent Protector',
    tagline: 'Private, boundaried, selectively open',
    chips: ['Decides what to share and when', 'Hard to read until trust is established', 'Self-reliant in communication'],
    description:
      'You communicate from a position of self-determination. What you share, and when, is yours to decide. This is not evasion — it is discernment. People who earn your trust find you more open and thoughtful than your initial reserve suggested. The threshold exists for real reasons.',
    patterns: [
      {
        icon: 'funnel-outline',
        title: 'You filter before you share',
        body: 'Before disclosing something personal, you tend to assess: is this person safe, is this the right moment, is this worth the exposure. Most people make this assessment quickly and unconsciously. You make it deliberately, and you hold the boundary until you are satisfied.',
      },
      {
        icon: 'hand-left-outline',
        title: 'You are hard to overwhelm',
        body: 'Emotional floods, high-pressure conversations, urgent demands for transparency — you handle these with more containment than most. This self-regulation is a genuine strength. It can also mean you absorb things internally that would benefit from being spoken.',
      },
      {
        icon: 'key-outline',
        title: 'Your trust, once extended, is real',
        body: 'You are not stingy with trust — you are selective with it. The people who earn access to your actual inner world often describe it as unexpectedly rich. The reserve at the surface is not the full story.',
      },
    ],
    conflictPattern:
      'In conflict, you tend to protect your inner world and limit your disclosure. You resolve things best when you have had space to process first. Emotionally invasive conversations are draining rather than clarifying for you.',
    bestEnvironment:
      'You work best where your boundaries are respected without requiring explanation. One-on-one conversations over group settings. Predictability and mutual respect over improvised emotional disclosure.',
    strengths: ['Emotional self-containment', 'Consistent boundaries', 'Deliberate trust'],
    blindSpot:
      'People who care about you may interpret your reserve as indifference. The gap between your internal experience and what you show externally is probably wider than you think. A small, selective increase in visibility — particularly during moments that matter — changes the relational equation significantly.',
    boundaryStyle: 'You set limits clearly and early, usually through withdrawal rather than direct statement. Others often feel the boundary before it is articulated. You are not interested in over-explaining your limits — you expect them to be respected once they are visible.',
    repairStyle: 'After conflict, you need significant time and space before re-engagement is possible. Coming back too quickly feels like unfinished business. When you do return, it is usually with clarity — but the period of distance can feel extended to others who process differently.',
    growthGuidance: 'Articulating limits verbally — rather than letting them be inferred from your behavior — shortens the distance others feel and reduces the chance of misinterpretation. Not all of your withdrawal is readable as a boundary. Some of it looks like rejection.',
  },
];

// ─── Combined archetypes ──────────────────────────────────────────────────────

export interface CombinedArchetype {
  key: string;
  label: string;
  tagline: string;
  chips: string[];
  description: string;
  strengths: string[];
  blindSpot: string;
  workStyle: string;
  stressResponse: string;
  growthEdge: string;
  relationshipGuidance: string;
  thriveConditions: string;
  whatDrivesYou: string;
}

export const COMBINED_ARCHETYPES: CombinedArchetype[] = [
  {
    key: 'ReflectiveSage',
    label: 'Deep Observer',
    tagline: 'Internally rich, quietly perceptive, selectively present',
    chips: ['Sees more than they show', 'Needs depth to stay engaged', 'Builds trust slowly, holds it long'],
    description:
      'You carry a rare combination: intellectual depth, emotional self-sufficiency, and careful communication. You observe more than you show, and what you do show has been considered carefully. The people who earn your trust tend to find a thinker of unusual precision and warmth.',
    strengths: ['Deep analysis', 'Emotional independence', 'Precise observation'],
    blindSpot:
      'Your internal richness is not always legible to people on the outside. What feels obvious to you may be completely invisible to someone who has not been let in. The gap between your inner experience and what you project can create distance you did not intend.',
    workStyle:
      'You do your best work with autonomy and uninterrupted time to think. Open-plan environments and rapid decision-making create friction. You tend to produce work that is unusually thorough — and you need conditions that reward that rather than penalize the time it takes.',
    stressResponse:
      'Under stress, you retreat inward. This is not avoidance — it is genuinely how you process. But sustained isolation can amplify tension rather than resolve it. A single honest conversation with a trusted person often shortens your recovery significantly.',
    growthEdge:
      'Practice letting people see your thinking before it is finished. Sharing your process — even partially, even tentatively — creates connection without requiring full vulnerability. Most people find it more interesting than you expect.',
    relationshipGuidance:
      'You connect best with people who do not require constant proof of your engagement. The invitation, for you, is to let a few people in further than feels strictly necessary — not because you owe it to them, but because it tends to produce the kind of closeness you actually want.',
    thriveConditions:
      'Uninterrupted time to think. Work that rewards depth over speed. Relationships where presence does not have to be constant to be real. Environments that notice quality rather than output volume.',
    whatDrivesYou:
      'Being in the presence of ideas that genuinely surprise you. The feeling of making something complex precise — whether that is an argument, a system, or an understanding of a person. Knowing, quietly, that you have seen something others have not yet noticed.',
  },
  {
    key: 'CalmArchitect',
    label: 'Calm Architect',
    tagline: 'Structured, composed, and quietly warm',
    chips: ['Plans before committing', 'Steady when others destabilize', 'Builds things that last'],
    description:
      'You bring both systems thinking and genuine warmth to how you operate. You are the person others turn to when clarity is needed and emotions are running high. You hold space without being swept up in it — and you build things that work, including relationships.',
    strengths: ['Strategic clarity', 'Reliability under pressure', 'Thoughtful leadership'],
    blindSpot:
      'Your structural preference can make improvisation or emotional ambiguity feel like a problem requiring a solution. Some relational experiences require presence rather than resolution. Sitting with something unresolved, without moving toward the fix, is a skill worth developing.',
    workStyle:
      'You are a natural project owner. You work best when you have clear parameters and genuine ownership. Ambiguity without structure is your main source of friction. You tend to produce unusually consistent results over time.',
    stressResponse:
      'Under stress, you often become even more focused and structured. This can feel reassuring to others, but it sometimes signals that you are managing rather than processing. Making room for the emotional component — even briefly — tends to produce better outcomes.',
    growthEdge:
      'Allow more room for the unfinished. Not every situation benefits from a framework. Some of your most useful thinking will come from sitting with uncertainty rather than immediately resolving it.',
    relationshipGuidance:
      'You are a stable and dependable partner. The growth edge is ensuring that your instinct toward solutions does not consistently bypass the emotional conversation. Sometimes what people need is not an answer but a witness.',
    thriveConditions:
      'Clear parameters and genuine ownership of your work. Time to plan before committing. Teams that value consistency over urgency. Environments where follow-through is respected as much as ideas.',
    whatDrivesYou:
      'Building systems and relationships that actually hold up — not just in ideal conditions, but under pressure. The satisfaction of seeing something you helped design work the way it was meant to. Being the person others can count on to be steady when the situation is not.',
  },
  {
    key: 'PassionateIdealist',
    label: 'Depth Connector',
    tagline: 'Emotionally present, invested, and expressively honest',
    chips: ['Communicates through feeling', 'Invests deeply in people', 'Wants meaning, not surface'],
    description:
      'Your emotional depth, relational investment, and expressive honesty make you genuinely present in a way many people are not. You care in ways that register — and you are not afraid to show it. This is not weakness. It is a specific form of relational courage.',
    strengths: ['Emotional range', 'Relational depth', 'Expressive authenticity'],
    blindSpot:
      'Intensity without pacing can sometimes overwhelm the people you are trying to reach. Learning when to hold some of your depth in reserve — not to suppress it, but to release it at a rate others can receive — is the art of your development.',
    workStyle:
      'You thrive in work that feels meaningful and connected to something real. You are most productive when the purpose is clear and genuinely matters to you. Work that feels hollow or disconnected from human impact tends to drain you faster than others notice.',
    stressResponse:
      'You feel stress vividly. You may express it openly, or you may collapse inward when it exceeds your capacity. Naming what you are experiencing — even to yourself first — tends to give you access to more choices about how to respond.',
    growthEdge:
      'Develop a practice of pausing between the feeling and the response. You lose nothing of your depth by adding a breath between them. The pause is not suppression; it is the difference between expression and communication.',
    relationshipGuidance:
      'You bring real warmth and investment to your relationships. The invitation is to build internal steadiness alongside your expressiveness — not as a replacement for it, but as the ground it can safely emerge from.',
    thriveConditions:
      'Work with a clear human purpose. People who meet your emotional investment with their own. Space to process out loud without being rushed toward a conclusion. Environments that value feeling as information, not noise.',
    whatDrivesYou:
      'Genuine human connection and the sense that what you are doing actually matters to real people. Work and relationships that carry meaning beyond the surface. The feeling of being fully understood — and of understanding someone else that completely.',
  },
  {
    key: 'GroundedExplorer',
    label: 'Grounded Explorer',
    tagline: 'Curious, secure, and openly adaptive',
    chips: ['Comfortable with uncertainty', 'Learns continuously', 'Engages without losing stability'],
    description:
      'You hold an unusual combination: genuine openness to new ideas and experiences, within a stable, secure foundation. You are not reckless in your curiosity — you are grounded in it. Change and novelty do not destabilize you; they interest you.',
    strengths: ['Intellectual openness', 'Emotional security', 'Adaptability under pressure'],
    blindSpot:
      'Your stability and openness can occasionally lead you to underestimate how destabilizing change feels for others. What feels like adventure to you can feel like threat to someone with less of either quality. Slowing down to bring people along — rather than assuming they will catch up — is often the higher-leverage move.',
    workStyle:
      'You are a natural learner and connector of ideas. Environments that reward curiosity, growth, and genuine collaboration bring out your best. Rigidity and bureaucracy are your primary friction.',
    stressResponse:
      'You tend to approach stress with curiosity before anxiety. This is a genuine asset. Occasionally, stress deserves to be felt fully before it is analyzed.',
    growthEdge:
      'Sit with not knowing occasionally — without reaching for a framework or a plan. Some of your most interesting thinking emerges in the gap between questions, before you have organized them.',
    relationshipGuidance:
      'You are a secure and growth-oriented partner. The invitation is to bring the same curiosity you apply to ideas to understanding how others experience closeness differently than you do.',
    thriveConditions:
      'Environments that reward genuine curiosity and growth. Work that evolves rather than repeating itself. Relationships where you can be both settled and exploring simultaneously. Teams that trust their people to figure things out.',
    whatDrivesYou:
      'Learning something genuinely new — not for credentials, but because the idea itself is interesting. Growth that is real rather than performed. Contributing to something you believe in, in a way that leaves room for your own curiosity to stay alive.',
  },
  {
    key: 'IndependentConnector',
    label: 'Independent Builder',
    tagline: 'Self-sufficient, selective, and quietly loyal',
    chips: ['Operates well alone', 'Values depth over frequency in relationships', 'Shows care through action'],
    description:
      'You have built a self that does not require constant external validation to function — and yet you genuinely value deep connection when it arrives on terms you can trust. You are not cold; you are selective. The people who earn your real attention find someone steady, perceptive, and unexpectedly warm.',
    strengths: ['Self-sufficiency', 'Selective depth', 'Consistent follow-through'],
    blindSpot:
      'Your independence can read as distance to people who do not know you well. You may be more connected than you appear — but the gap between internal warmth and external visibility is wider than you realize. People often do not know where they stand with you, and that ambiguity costs relationships.',
    workStyle:
      'You are most effective with genuine autonomy and clear ownership. You do not need frequent check-ins or collaborative consensus to stay on track. Trust and space are what you trade for consistent, high-quality output.',
    stressResponse:
      'Under stress, you pull in and handle things yourself. This works — up to a point. Sustained solitude during difficulty can become its own problem. An intentional, brief reach-out tends to reset things faster than silence can.',
    growthEdge:
      'Give people slightly more access to your inner world than feels strictly necessary. The cost is low. The relational return is often surprisingly large.',
    relationshipGuidance:
      'You offer your partners something real: steadiness, competence, and genuine depth — when they earn it. The invitation is to lower the earning threshold slightly, before people have fully demonstrated they deserve it.',
    thriveConditions:
      'Genuine autonomy and clear ownership. Work that rewards consistent quality over social performance. Relationships that do not require constant maintenance to stay real. Space to process privately before being asked to respond.',
    whatDrivesYou:
      'Solving something difficult and doing it well, without needing the process to be validated at every step. The quiet satisfaction of quality work. Deep, earned trust with a small number of people who have genuinely proven they deserve access to your inner world.',
  },
  {
    key: 'ExpressiveArchitect',
    label: 'Expressive Architect',
    tagline: 'Creative, organized, and warmly direct',
    chips: ['Communicates ideas with energy', 'Builds as well as imagines', 'Brings people into the vision'],
    description:
      'You are a rare blend of creative energy and structural discipline. You do not just generate ideas — you build them into things that work. And you bring people along with genuine warmth and expressive clarity. The combination of imagination and execution is not common.',
    strengths: ['Creative execution', 'Expressive leadership', 'Systems thinking with warmth'],
    blindSpot:
      'Your energy and pace can move faster than the people around you. Not everyone processes at your speed, and assuming they do consistently leaves people behind. Slowing down to bring others into your thinking — not just the output — is often the highest-leverage use of your time.',
    workStyle:
      'You thrive at the intersection of vision and execution. You are the person who can see the big picture and the implementation path simultaneously, and communicate both with energy. Environments that separate strategy from execution tend to underuse you.',
    stressResponse:
      'Under stress, you may become hyper-productive — building to manage anxiety — or expressive to the point of overwhelm. Noticing which mode you are in, and choosing the response deliberately, is a key skill.',
    growthEdge:
      'Develop more comfort with unfinished ideas. Your impulse to complete and structure can occasionally close off directions before they have had time to develop. Holding something open a little longer can change what it eventually becomes.',
    relationshipGuidance:
      'You bring warmth, creativity, and genuine follow-through to relationships. The invitation is to make space for others to define the direction sometimes — not because your direction is wrong, but because shared ownership deepens connection in ways unilateral generosity does not.',
    thriveConditions:
      'Roles where you can see both the big picture and the implementation path. Environments that value originality without sacrificing follow-through. Teams that match your energy without requiring you to slow down for bureaucratic reasons. Creative latitude within real constraints.',
    whatDrivesYou:
      'Bringing a vision from concept to reality — and bringing others into it with clarity and energy. Work where creativity and execution exist in the same space. The experience of finishing something you built and having it actually work.',
  },
  {
    key: 'SensitiveGuide',
    label: 'Sensitive Strategist',
    tagline: 'Empathetic, insightful, and quietly influential',
    chips: ['Reads people with precision', 'Holds emotional weight well', 'Understands before advising'],
    description:
      'Your emotional intelligence and relational precision make you a natural guide for others — whether or not that is a formal role you occupy. You see people clearly, you understand their dynamics, and you respond with genuine care. People often come to you before they go elsewhere.',
    strengths: ['Emotional intelligence', 'Relational depth', 'Quiet influence'],
    blindSpot:
      'You give a great deal of yourself to others, and you may find it genuinely harder to ask for the same in return. Your insight into others\' experience does not always translate to clear recognition of your own needs. Directing some of that perceptiveness inward is the work.',
    workStyle:
      'You are most effective in roles that value human insight, collaboration, and relational awareness. You tend to be the person who holds the emotional health of a system — team, relationship, family — often without formal recognition for it.',
    stressResponse:
      'Under stress, you may absorb the emotional weight of others more readily than you process your own. The distinction between empathy and responsibility — between feeling something with someone and feeling responsible for fixing it — is a distinction worth practicing.',
    growthEdge:
      'Build a deliberate practice of receiving. Let yourself be known with the same willingness with which you know others. The people who care about you want access to your inner experience, not just your insight.',
    relationshipGuidance:
      'You are a deeply attentive partner. The invitation is to turn some of that attentiveness toward your own needs as clearly as you direct it toward others. Being known is not less valuable than knowing.',
    thriveConditions:
      'Work that connects to human outcomes. Relationships where your insight is valued, not just your output. Environments with enough psychological safety that you can say what you actually observe. Time to tune in without constant external demands.',
    whatDrivesYou:
      'Seeing someone understand something about themselves that was previously unclear — and knowing you helped create the conditions for that. Relationships and work where your emotional intelligence is genuinely useful, not just decorative. Contributing to something that involves and benefits real people.',
  },
  {
    key: 'AdaptiveRealist',
    label: 'Adaptive Realist',
    tagline: 'Balanced, pragmatic, and quietly steady',
    chips: ['Adapts to what is actually required', 'Grounds others with their perspective', 'Pragmatic without being cynical'],
    description:
      'You do not lean heavily toward any single extreme — and that balance is a genuine strength, not an absence of identity. You adapt to what each situation actually requires and bring a grounded pragmatism that others find stabilizing. You tend to see things as they are rather than as you wish they were.',
    strengths: ['Situational adaptability', 'Pragmatic judgment', 'Emotional balance'],
    blindSpot:
      'Your flexibility can occasionally leave others uncertain of where you actually stand. Committing clearly to a position — when you have one — gives people more confidence in you than your equilibrium alone does. You have views. Sharing them creates more influence, not less.',
    workStyle:
      'You are effective across a wide range of environments and can bridge between different working styles. Your versatility is your advantage — particularly in complex, cross-functional contexts where others are too specialized to adapt.',
    stressResponse:
      'You tend to manage stress without drama, which is an asset. Ensure that apparent composure is not deferred processing. Sometimes the emotional work needs to happen before the practical response.',
    growthEdge:
      'Lean into something specific — a strength, an interest, a conviction — and develop it beyond balance. Balance is the foundation. Depth is what gets built on top of it.',
    relationshipGuidance:
      'You are an adaptable and stable partner. People trust you. The growth edge is ensuring that your adaptability does not consistently come at the cost of expressing what you actually want and need.',
    thriveConditions:
      'Environments that reward versatility and practical judgment. Work with real variety over long periods of repetition. Teams that trust you to adapt without requiring you to justify every decision. Relationships where stability and flexibility coexist without tension.',
    whatDrivesYou:
      'Doing work that is genuinely useful in whatever form that takes. The sense of being relied upon across different contexts — not for a narrow specialty, but for sound judgment. Stability with enough variety to keep engagement real.',
  },
];

// ─── Type Archetypes ──────────────────────────────────────────────────────────

export interface TypeArchetype {
  key: string;       // 4-letter code e.g. 'INTJ'
  typeCode: string;  // same as key
  label: string;     // premium name e.g. 'Strategic Architect'
  tagline: string;
  chips: [string, string, string];
  description: string;
  patterns: [
    { icon: string; title: string; body: string },
    { icon: string; title: string; body: string },
    { icon: string; title: string; body: string },
  ];
  strengths: [string, string, string];
  blindSpot: string;
  growthEdge: string;
  workStyle: string;
  relationshipStyle: string;
}

export const TYPE_ARCHETYPES: TypeArchetype[] = [
  {
    key: 'INTJ', typeCode: 'INTJ', label: 'Strategic Architect',
    tagline: 'Visionary thinking, quietly executed.',
    chips: ['Long-range planner', 'Systems thinker', 'Independent'],
    description: 'You see the whole board before others have noticed the pieces. Your thinking is structured around long-term outcomes, and you build toward them with quiet determination. You need meaningful work and resist being managed toward someone else\'s idea of success.',
    patterns: [
      { icon: 'telescope-outline', title: 'You plan further ahead than most', body: 'While others react, you have already modeled what comes next. This gives you unusual composure under pressure.' },
      { icon: 'layers-outline', title: 'You hold high standards', body: 'Mediocre output is genuinely uncomfortable for you. This drives quality — and occasionally friction with people who don\'t share the bar.' },
      { icon: 'lock-closed-outline', title: 'You protect your inner world carefully', body: 'Trust is extended selectively. You open up slowly, and only to people who have earned it.' },
    ],
    strengths: ['Strategic foresight', 'Intellectual depth', 'Self-directed drive'],
    blindSpot: 'You may underestimate how your directness lands on others, especially when you\'re focused on getting to the right answer.',
    growthEdge: 'Letting others into your thinking process before the plan is complete — collaboration as input, not just output.',
    workStyle: 'You do your best work when you have genuine ownership of the problem and the latitude to solve it your way. Collaboration is useful when it adds thinking you do not have — not as a process requirement. You need work that rewards depth and precision.',
    relationshipStyle: 'You invest deeply in a very small number of people, and that investment is real. Closeness builds through shared thinking and mutual respect, not through frequency or warmth alone. You can be more emotionally available than you appear — the barrier is trust, not feeling.',
  },
  {
    key: 'INTP', typeCode: 'INTP', label: 'Independent Analyst',
    tagline: 'Curious about everything. Certain about little.',
    chips: ['Conceptual thinker', 'Truth-seeking', 'Autonomous'],
    description: 'You follow ideas wherever they lead, often long past the point where others have moved on. Your mind works by questioning assumptions and building mental models from scratch. You value accuracy over agreement — and will say so.',
    patterns: [
      { icon: 'git-branch-outline', title: 'You explore ideas in depth', body: 'You rarely accept surface explanations. Following a question to its root is where you feel most alive.' },
      { icon: 'flask-outline', title: 'You think in systems and models', body: 'Before you act, you want to understand how the pieces fit. This produces insight others miss.' },
      { icon: 'time-outline', title: 'You resist premature closure', body: 'Deciding before you\'ve fully understood something feels wrong to you — even when speed is the priority.' },
    ],
    strengths: ['Conceptual precision', 'Independent reasoning', 'Curiosity-driven insight'],
    blindSpot: 'Finishing things. The exploration is more interesting than the conclusion — which can leave projects unresolved.',
    growthEdge: 'Choosing done over perfect when the context calls for it, without abandoning your standards entirely.',
    workStyle: 'You are most productive when you can follow a problem to its root without artificial deadlines cutting off the process. Environments that measure output over depth tend to frustrate you. You produce your best work in independent conditions with access to information and time.',
    relationshipStyle: 'Close relationships develop slowly for you, through accumulated experience of being understood. You value intellectual connection and genuine interest in your thinking. Physical presence is not necessary for you to feel close — shared depth is.',
  },
  {
    key: 'ENTJ', typeCode: 'ENTJ', label: 'Decisive Leader',
    tagline: 'Moves toward outcomes, not conversations.',
    chips: ['Strategic executor', 'Direct communicator', 'Growth-oriented'],
    description: 'You see inefficiency and feel compelled to fix it. You think in goals and move toward them with energy that pulls others along — sometimes before they\'ve decided to follow. You lead naturally, and you expect results from yourself and others.',
    patterns: [
      { icon: 'trending-up-outline', title: 'You think in outcomes', body: 'Every conversation, plan, and decision gets evaluated against what it produces. Anything that doesn\'t move things forward drains you.' },
      { icon: 'megaphone-outline', title: 'You communicate with directness', body: 'You say what needs to be said. In fast-moving situations, this is a gift. In more personal ones, it requires calibration.' },
      { icon: 'rocket-outline', title: 'You raise the bar around you', body: 'People working alongside you tend to perform better. Your expectations are high — and usually visible.' },
    ],
    strengths: ['Goal clarity', 'Decisive action', 'Natural leadership presence'],
    blindSpot: 'Slowing down to hear people who process differently. Speed and conviction can crowd out the input you actually need.',
    growthEdge: 'Learning when to pause before deciding — not as doubt, but as strategy.',
    workStyle: 'You operate best with clear goals, real authority, and high stakes. You think faster than most people around you, which means you need colleagues who can keep up or move aside. You lead regardless of whether you have the title.',
    relationshipStyle: 'You are more emotionally invested in your close relationships than your exterior suggests. You show care through action, presence, and honesty — including difficult honesty. You need partners and friends who are direct with you in return.',
  },
  {
    key: 'ENTP', typeCode: 'ENTP', label: 'Curious Challenger',
    tagline: 'Questions assumptions as a reflex.',
    chips: ['Conceptual debater', 'Possibility-driven', 'Adaptive thinker'],
    description: 'You can argue any side of an argument and find the weakest point in any plan. This isn\'t contrarianism — it\'s how you stress-test ideas. You thrive in environments where ideas compete and the best one wins.',
    patterns: [
      { icon: 'bulb-outline', title: 'You generate ideas rapidly', body: 'Your mind produces options faster than most. The challenge is choosing which ones to pursue.' },
      { icon: 'chatbubbles-outline', title: 'You debate to understand', body: 'Arguing a position isn\'t always about winning — often it\'s how you figure out what you actually think.' },
      { icon: 'infinite-outline', title: 'You resist repetition', body: 'Once something is figured out, it stops being interesting. You want the next unsolved thing.' },
    ],
    strengths: ['Rapid ideation', 'Systems-level challenge', 'Intellectual flexibility'],
    blindSpot: 'Follow-through after the creative burst. Ideas need execution, and execution is where the interest tends to drop.',
    growthEdge: 'Choosing one thread and seeing it through, even after the novelty fades.',
    workStyle: 'You are most engaged when the work has not been solved before and the rules are not fixed yet. You get bored in roles that optimize execution over invention. You need intellectual peers and contexts where your ability to challenge assumptions is an asset, not a liability.',
    relationshipStyle: 'You connect through ideas and debate, often more than through emotional conversation. You respect people who push back on you, and you may find those who do not oddly unsatisfying as close companions. Care shows up as sustained interest in who someone is becoming.',
  },
  {
    key: 'INFJ', typeCode: 'INFJ', label: 'Reflective Idealist',
    tagline: 'Deep values, quiet conviction.',
    chips: ['Values-driven', 'Pattern reader', 'Selective connector'],
    description: 'You hold strong inner convictions about how things should be — and you pursue them quietly but persistently. You notice undercurrents others miss, and you hold a vision of what is possible that can feel private until it\'s ready to be shared.',
    patterns: [
      { icon: 'eye-outline', title: 'You read the room without trying', body: 'Emotional undercurrents, unspoken dynamics, shifts in energy — you notice them naturally, sometimes without knowing why.' },
      { icon: 'compass-outline', title: 'Your values are load-bearing', body: 'When something conflicts with what you fundamentally believe, you feel it immediately — even if you don\'t always say so.' },
      { icon: 'moon-outline', title: 'You process privately before sharing', body: 'Your thinking happens internally first. By the time you speak, you\'ve usually been carrying the idea for a while.' },
    ],
    strengths: ['Intuitive perception', 'Deep empathy', 'Long-range vision'],
    blindSpot: 'Perfectionism that delays sharing until the idea feels complete enough — which may never come.',
    growthEdge: 'Letting people into the process, not just the product.',
    workStyle: 'You need your work to align with something you believe in, or the energy will not be there regardless of the pay. You work best when you have privacy to think and time to develop ideas before they are tested. Environments that value intuition and depth are where you contribute most.',
    relationshipStyle: 'You form very close bonds with very few people. You are often more attuned to others\' emotional states than to your own. You show up fully for people you trust — but the door to that trust opens slowly, and closes quickly if something fundamental is violated.',
  },
  {
    key: 'INFP', typeCode: 'INFP', label: 'Depth Seeker',
    tagline: 'Meaning first. Everything else second.',
    chips: ['Values-led', 'Introspective', 'Authenticity-driven'],
    description: 'You move toward what feels true and meaningful, and away from what feels hollow or performative. You have an inner life that runs deep, and you protect it. Authenticity isn\'t a value for you — it\'s a requirement.',
    patterns: [
      { icon: 'heart-outline', title: 'You need your work to mean something', body: 'Going through the motions in something that doesn\'t feel real is quietly exhausting. Purpose is the fuel, not the bonus.' },
      { icon: 'person-outline', title: 'You take things to heart', body: 'Feedback, conflict, or being misunderstood tends to land deeper than you\'d prefer. You process fully before you let it go.' },
      { icon: 'leaf-outline', title: 'You have a strong inner compass', body: 'When something conflicts with your values, you know immediately — even when it\'s hard to articulate why.' },
    ],
    strengths: ['Emotional authenticity', 'Deep personal values', 'Creative inner life'],
    blindSpot: 'Difficulty with criticism when it touches something identity-adjacent.',
    growthEdge: 'Separating feedback about the work from feedback about you — as a practice, not just a concept.',
    workStyle: 'Meaning is not a bonus for you — it is the fuel. You can sustain significant effort in work that feels authentic, and very little in work that does not. You are creative and introspective, and you produce your best output when given ownership and purpose rather than process.',
    relationshipStyle: 'You love deeply and for a long time — often longer than the other person realises. Authenticity in a relationship matters to you more than consistency or frequency. You need the people close to you to meet you in depth, not just in practicality.',
  },
  {
    key: 'ENFJ', typeCode: 'ENFJ', label: 'Warm Catalyst',
    tagline: 'Brings people together toward something better.',
    chips: ['People-centered', 'Inspiring presence', 'Emotionally attuned'],
    description: 'You notice what people need and move to provide it — often before they\'ve asked. You lead through connection, not command. You\'re most energized when you\'re helping someone grow or bringing a group toward something meaningful.',
    patterns: [
      { icon: 'people-outline', title: 'You invest in people genuinely', body: 'You remember what someone mentioned weeks ago. You notice when someone is off. This attentiveness is rare and felt.' },
      { icon: 'sunny-outline', title: 'You project warmth naturally', body: 'People tend to open up around you faster than usual. This is a gift — and occasionally a magnet for those who need more than you can give.' },
      { icon: 'ribbon-outline', title: 'You carry the emotional weight of a group', body: 'You\'re aware of everyone\'s state in a room. This can be a superpower and a drain depending on the day.' },
    ],
    strengths: ['Relational leadership', 'Genuine warmth', 'Inspiring others into growth'],
    blindSpot: 'Giving more than is sustainable, and not noticing the depletion until it\'s significant.',
    growthEdge: 'Naming your own needs as clearly as you name others\'. Reciprocity is not a failure of generosity.',
    workStyle: 'You are energised by work that serves people in a visible way. You collaborate naturally, often becoming the person who holds the group together emotionally. You do your best work when you can see the human impact — and when the people around you are growing.',
    relationshipStyle: 'You give a lot to the people you love — often more than they have asked for. Your attunement to others\' needs is a genuine gift, and it can lead to connections that feel rare. The challenge is ensuring you receive as clearly as you give.',
  },
  {
    key: 'ENFP', typeCode: 'ENFP', label: 'Open Visionary',
    tagline: 'Excited by what could be, moved by who people are.',
    chips: ['Enthusiastic connector', 'Future-focused', 'Expressive thinker'],
    description: 'You are energized by possibility and by people. You move through the world with curiosity and warmth, often generating ideas and connections that others wouldn\'t have seen. You need environments that give you room to explore — and people who can match your energy.',
    patterns: [
      { icon: 'star-outline', title: 'You see potential everywhere', body: 'In people, in projects, in half-formed ideas. This is your greatest strength — and occasionally a trap if you spread too wide.' },
      { icon: 'flash-outline', title: 'Your enthusiasm is contagious', body: 'When you\'re energized, others feel it. You have a natural ability to get people excited about a direction.' },
      { icon: 'shuffle-outline', title: 'You resist being boxed in', body: 'Fixed roles, rigid processes, closed conversations — they feel constraining in a way that\'s hard to explain to people who don\'t feel it.' },
    ],
    strengths: ['Creative vision', 'Relational energy', 'Adaptive enthusiasm'],
    blindSpot: 'Committing and following through when the initial excitement fades.',
    growthEdge: 'Building systems that hold you accountable to your own intentions — without killing the spontaneity.',
    workStyle: 'You are energised by possibility, novelty, and connection. You bring ideas and enthusiasm that others build on. The challenge is sustaining effort through the parts of a project that are less interesting — which is where structure or accountability partnerships help.',
    relationshipStyle: 'You fall quickly and warmly into connection with people you find interesting. Your enthusiasm for people is genuine, and it tends to be felt. You need depth alongside energy — relationships that can hold both the exciting version of you and the quieter one.',
  },
  {
    key: 'ISTJ', typeCode: 'ISTJ', label: 'Grounded Executor',
    tagline: 'Does what they say. Says what they mean.',
    chips: ['Reliable', 'Detail-oriented', 'Procedurally strong'],
    description: 'You are someone others rely on — and you take that seriously. You follow through, you track the details, and you build trust through consistency over time. You may not be the loudest voice in the room, but you are usually the one who actually gets it done.',
    patterns: [
      { icon: 'checkmark-done-outline', title: 'You complete what you start', body: 'Half-finished work is uncomfortable for you. You follow through, and you expect others to do the same.' },
      { icon: 'shield-checkmark-outline', title: 'You are quietly dependable', body: 'Your reliability compounds. People who know you well trust you deeply, because you\'ve earned it with actions, not words.' },
      { icon: 'document-text-outline', title: 'You prefer clarity over ambiguity', body: 'Vague goals and shifting expectations are genuinely difficult. You work best when the scope is defined and the expectation is clear.' },
    ],
    strengths: ['Follow-through', 'Practical reliability', 'Attention to process'],
    blindSpot: 'Rigidity when a situation calls for improvisation or a change of plan.',
    growthEdge: 'Holding your standards while staying curious about whether the procedure still fits the problem.',
    workStyle: 'You are most productive in environments with clear expectations, defined processes, and accountability. You do not need inspiration — you need clarity and a system you can trust. You are the person who ensures things actually get done correctly.',
    relationshipStyle: 'You show love through reliability and action, not through expression. The people close to you know they can count on you — and they are right. You are slower to express emotion verbally, but your commitments are deeply consistent.',
  },
  {
    key: 'ISFJ', typeCode: 'ISFJ', label: 'Quiet Sustainer',
    tagline: 'Holds things together without needing credit.',
    chips: ['Steady support', 'Warm reliability', 'Detail-conscious'],
    description: 'You notice what needs doing and you do it — often without announcement. You invest in the people around you and remember what matters to them. Your care shows up in actions, not declarations.',
    patterns: [
      { icon: 'home-outline', title: 'You create stability for others', body: 'The environments you\'re part of tend to run more smoothly because you\'re quietly attending to things others haven\'t noticed yet.' },
      { icon: 'person-circle-outline', title: 'You remember the small things', body: 'What someone mentioned in passing, a preference they mentioned once, how they like to be acknowledged — you track these naturally.' },
      { icon: 'hand-left-outline', title: 'You find it hard to say no', body: 'Letting people down feels genuinely uncomfortable. This generosity is real — and sometimes needs a limit.' },
    ],
    strengths: ['Consistent care', 'Practical attentiveness', 'Quiet dependability'],
    blindSpot: 'Overextending without signaling it, until the cost becomes unavoidable.',
    growthEdge: 'Naming what you need before you\'re already depleted.',
    workStyle: 'You work best when you understand how your contribution fits into something larger. You are thorough, reliable, and often the person who holds operational details together. Environments that notice consistent quality — rather than just high-profile contribution — are where you thrive.',
    relationshipStyle: 'You love quietly and deeply. You invest in people over time through memory, attention, and care. Your relationships tend to build steadily — and once built, they last. You may find it easier to give than to ask, which is the growth edge.',
  },
  {
    key: 'ESTJ', typeCode: 'ESTJ', label: 'Reliable Director',
    tagline: 'Clear expectations. Consistent execution.',
    chips: ['Organized leader', 'Standards-driven', 'Direct communicator'],
    description: 'You bring order to complexity. You set expectations clearly, track progress, and hold people accountable — including yourself. You believe systems exist for a reason and that following through on commitments is a matter of respect.',
    patterns: [
      { icon: 'grid-outline', title: 'You create structure others can rely on', body: 'In ambiguous situations, people look to you. You have the ability to impose clarity on a confusing situation quickly.' },
      { icon: 'podium-outline', title: 'You lead through accountability', body: 'You hold yourself and others to clear standards. This is respected — and occasionally felt as pressure.' },
      { icon: 'briefcase-outline', title: 'You value competence and effort', body: 'Sloppy work is uncomfortable to be around. You care about getting things right and doing them properly.' },
    ],
    strengths: ['Organizational clarity', 'Accountability', 'Efficient execution'],
    blindSpot: 'Flexibility when the situation has genuinely changed and the old structure no longer fits.',
    growthEdge: 'Distinguishing between standards worth defending and rigidity that serves no one.',
    workStyle: 'You operate best with clear authority, measurable goals, and a team that follows through on commitments. You create systems and hold people to them — including yourself. You are most valuable in environments that need order and accountability, not just ideas.',
    relationshipStyle: 'You are more dependable than expressive, and the people close to you often know the difference. Your care is demonstrated through presence, loyalty, and reliability. You may not always say how you feel — but you show up consistently.',
  },
  {
    key: 'ESFJ', typeCode: 'ESFJ', label: 'Warm Organizer',
    tagline: 'Gets people aligned. Makes things run.',
    chips: ['Connector', 'Practically warm', 'Community-builder'],
    description: 'You bring people together and keep things moving — not through authority, but through attentiveness and care. You\'re aware of how the group is doing, and you take action to make it better. The social and the practical live close together for you.',
    patterns: [
      { icon: 'people-circle-outline', title: 'You tend to the group', body: 'You notice tension before it surfaces, who hasn\'t spoken, who is struggling. This attentiveness keeps groups functioning.' },
      { icon: 'calendar-outline', title: 'You make logistics happen', body: 'Coordination, follow-up, keeping track of what was agreed — you manage these without needing recognition for them.' },
      { icon: 'heart-circle-outline', title: 'Harmony matters to you', body: 'Conflict is uncomfortable. You\'d rather find the path that keeps everyone together than win an argument that splits the room.' },
    ],
    strengths: ['Relational coordination', 'Warm follow-through', 'Group attentiveness'],
    blindSpot: 'Prioritizing harmony at the cost of honesty when the honest thing would actually help.',
    growthEdge: 'Being direct when care requires it — not just when it\'s comfortable.',
    workStyle: 'You coordinate people naturally and make systems run through attentiveness and follow-through. You are energised by work that serves others and involves visible human connection. You prefer environments where relationships and results go together.',
    relationshipStyle: 'Relationships are central to how you experience the world. You invest in the people around you practically and emotionally. You are aware of how everyone is doing, and you take steps to help — sometimes at the cost of your own needs.',
  },
  {
    key: 'ISTP', typeCode: 'ISTP', label: 'Practical Adapter',
    tagline: 'Figures it out. Does it efficiently.',
    chips: ['Problem-solver', 'Hands-on thinker', 'Independent operator'],
    description: 'You are at your best when something real needs to be solved, built, or fixed. You think by doing, prefer efficiency over explanation, and tend to figure things out on your own before asking for help. You work well under pressure.',
    patterns: [
      { icon: 'construct-outline', title: 'You learn by doing', body: 'Trial and observation is more useful to you than instruction. You figure out how things work by engaging with them directly.' },
      { icon: 'flash-outline', title: 'You are calm in a crisis', body: 'When things go wrong, you shift into problem-solving mode quickly. The emotional noise others generate is not where you put your attention.' },
      { icon: 'expand-outline', title: 'You need autonomy to function well', body: 'Being managed closely or overexplained to is frustrating. You need space to work in your own way.' },
    ],
    strengths: ['Practical problem-solving', 'Calm under pressure', 'Efficient independence'],
    blindSpot: 'Communicating your process. Others may not know what you\'re doing or why — which can create unnecessary distance.',
    growthEdge: 'Proactively updating others as a tool for building trust, even when it feels unnecessary.',
    workStyle: 'You solve problems most efficiently when left to work through them in your own way. Micro-management and overexplanation slow you down. You are best placed in roles where practical judgment and hands-on competence are what matter.',
    relationshipStyle: 'You are more emotionally available than you look, but only with people who give you genuine space. Close relationships are built through shared experience, not conversation. You do not need much — but what you need, you need consistently.',
  },
  {
    key: 'ISFP', typeCode: 'ISFP', label: 'Attentive Realist',
    tagline: 'Grounded in the present. Guided by values.',
    chips: ['Present-focused', 'Values-sensitive', 'Quietly expressive'],
    description: 'You notice what is actually here — the texture of a situation, the mood in a room, the way something feels rather than how it\'s described. You act from your values quietly, without needing to announce them.',
    patterns: [
      { icon: 'color-palette-outline', title: 'You respond to what is real', body: 'Abstract planning is less interesting to you than engaging with what\'s actually in front of you. Your best thinking is situational.' },
      { icon: 'ear-outline', title: 'You absorb atmosphere', body: 'You are unusually sensitive to the emotional quality of spaces, conversations, and people — even when nothing has been said directly.' },
      { icon: 'ribbon-outline', title: 'You live your values quietly', body: 'You don\'t often announce what you believe. But you tend not to act against it, either.' },
    ],
    strengths: ['Sensory attentiveness', 'Values integrity', 'Present-moment focus'],
    blindSpot: 'Asserting what you need before the situation has already moved past the point where it mattered.',
    growthEdge: 'Speaking up earlier when something conflicts with your values — before the cost builds quietly.',
    workStyle: 'You work best when the work has aesthetic, practical, or human meaning you can feel. Abstract performance metrics disconnected from real output are draining. You need environments where quality and authenticity matter more than appearance.',
    relationshipStyle: 'You love in a quiet, specific, and often practical way. You notice the small things that matter to people and act on them. You do not need emotional intensity in a relationship — you need authenticity and space.',
  },
  {
    key: 'ESTP', typeCode: 'ESTP', label: 'Direct Initiator',
    tagline: 'Moves fast. Adjusts as it goes.',
    chips: ['Action-oriented', 'Pragmatic', 'Energizing presence'],
    description: 'You prefer doing over planning, and you prefer now over later. You make decisions quickly, adjust when you need to, and rarely spend long in analysis when action is available. You bring momentum — and you expect people to keep up.',
    patterns: [
      { icon: 'walk-outline', title: 'You act first', body: 'Where others are still analyzing, you\'ve already moved. You get information from doing, not from theorizing.' },
      { icon: 'pulse-outline', title: 'You raise the energy in a room', body: 'Your presence tends to accelerate things. Conversations get more direct, decisions get made, momentum builds.' },
      { icon: 'alert-circle-outline', title: 'You notice what is real right now', body: 'Trends, patterns, and theory are less interesting to you than what\'s happening in front of you that needs a response.' },
    ],
    strengths: ['Fast decision-making', 'Practical adaptability', 'High-energy initiative'],
    blindSpot: 'Patience with processes that exist for reasons you haven\'t fully seen yet.',
    growthEdge: 'Slowing down long enough to understand a system before optimizing it.',
    workStyle: 'You are most effective when there is a real problem to solve, immediate feedback to work with, and room to improvise. Over-process and under-action frustrate you. You thrive in fast-moving environments where results matter more than method.',
    relationshipStyle: 'You connect quickly and warmly, but the depth of that connection varies. You show care through presence, action, and humor. The people who know you well describe you as more loyal than you might advertise.',
  },
  {
    key: 'ESFP', typeCode: 'ESFP', label: 'Expressive Momentum',
    tagline: 'Brings life into the room.',
    chips: ['Spontaneous', 'People-energizing', 'Present-focused'],
    description: 'You live in the present and you make the present more alive for everyone around you. You are warm, expressive, and genuinely interested in people. You don\'t need a plan — you need room to respond to what\'s actually happening.',
    patterns: [
      { icon: 'sparkles-outline', title: 'You make ordinary moments better', body: 'You have a gift for lifting the energy in a room, finding what\'s fun or interesting in an ordinary situation.' },
      { icon: 'people-outline', title: 'You connect with people quickly', body: 'You are genuinely curious about others and it shows. People feel at ease around you fast.' },
      { icon: 'today-outline', title: 'You live in the now', body: 'Long-term planning is less interesting than what\'s in front of you. You trust yourself to handle what comes.' },
    ],
    strengths: ['Spontaneous warmth', 'Present-moment joy', 'Expressive connection'],
    blindSpot: 'Preparation and forward planning when they would genuinely help.',
    growthEdge: 'Building in enough structure to protect future-you from the decisions present-you makes.',
    workStyle: 'You are most engaged when the work involves people, variety, and visible results. Repetitive tasks without social contact drain you quickly. You bring warmth and energy to collaborative environments and tend to raise morale without trying.',
    relationshipStyle: 'You connect fast and genuinely, and you bring joy to the people around you. Sustaining depth through the less exciting phases of a close relationship — the ones that require patience or difficult conversation — is where your relational growth tends to happen.',
  },
];

export const TRAIT_HIGH: Record<string, string> = {
  O: 'You are drawn to ideas, novelty, and complexity. New frameworks, unconventional thinking, and open-ended questions tend to energise you. You are more likely than most to be changed by a good conversation.',
  C: 'You bring genuine follow-through and structure to almost everything you take on. Commitments feel real to you. You tend to hold yourself to a consistent standard even when no one is watching.',
  E: 'You are energised by contact with people and drawn toward environments where things are happening. Social engagement fills rather than drains you. Isolation for extended periods becomes uncomfortable fairly quickly.',
  A: 'You lead with warmth and tend toward cooperation over competition. You are genuinely responsive to others\' needs and states. This makes you easy to work with and often a stabilising presence — at some cost to your own directness.',
  N: 'You feel things fully and often notice the emotional texture of situations before others do. Your sensitivity is real information — it tells you things. The challenge is distinguishing signal from noise, especially under stress.',
};

export const TRAIT_LOW: Record<string, string> = {
  O: 'You prefer what is concrete, tested, and reliable. Proven approaches give you more confidence than novel ones, and you trust experience over theory. This is a strength in contexts where consistency and precision matter.',
  C: 'You work best with flexibility and open-ended timelines. Fixed processes and rigid planning tend to feel constraining. You often do your best thinking in response to what is actually happening rather than what was anticipated.',
  E: 'You restore through solitude and prefer depth over breadth in your social world. Extended social contact is tiring regardless of how much you enjoy it. Your best thinking happens in quiet, and you are more present in small groups than large ones.',
  A: 'You tend to be more analytic than accommodating when interests conflict. You are direct and willing to disagree, which is useful in contexts where truth matters more than harmony. It can create friction in environments built around consensus.',
  N: 'You tend to stay regulated under conditions that would destabilise others. Emotional pressure does not quickly disrupt your functioning. This is a genuine strength in high-stakes situations — and something to stay aware of when others around you are struggling.',
};
