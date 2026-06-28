import { Question } from '../../types/assessment';

export const typeQuestions: Question[] = [
  // ── Section 1: Energy & Focus (EI axis) ────────────────────────────────────
  // higher score = Extraversion
  { id: 'ty_ei_01', text: 'I feel energized after spending time in a group.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_02', text: 'I often think out loud and find talking helps me clarify my ideas.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_03', text: 'I find social gatherings draining, even when I enjoy them.', dimension: 'EI', reverse: true, section: 1 },
  { id: 'ty_ei_04', text: 'I prefer to have a wide circle of acquaintances over a few close friends.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_05', text: 'I need quiet time alone to recharge after a busy day.', dimension: 'EI', reverse: true, section: 1 },
  { id: 'ty_ei_06', text: 'I tend to jump into conversations and share ideas as they come to me.', dimension: 'EI', reverse: false, section: 1 },
  { id: 'ty_ei_07', text: 'I feel most focused when I have uninterrupted time to work alone.', dimension: 'EI', reverse: true, section: 1 },
  { id: 'ty_ei_08', text: 'Being around people gives me momentum I would not find on my own.', dimension: 'EI', reverse: false, section: 1 },

  // ── Section 2: Perception & Possibility (SN axis) ──────────────────────────
  // higher score = Intuition (N)
  { id: 'ty_sn_01', text: 'I am more interested in what something could become than what it currently is.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_02', text: 'I trust concrete facts and direct experience more than theories or patterns.', dimension: 'SN', reverse: true, section: 2 },
  { id: 'ty_sn_03', text: 'I often notice connections between ideas that seem unrelated on the surface.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_04', text: 'I prefer clear, step-by-step instructions over open-ended possibilities.', dimension: 'SN', reverse: true, section: 2 },
  { id: 'ty_sn_05', text: 'I find myself drawn to hypotheticals, metaphors, and big-picture thinking.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_06', text: 'I pay close attention to details that others often overlook.', dimension: 'SN', reverse: true, section: 2 },
  { id: 'ty_sn_07', text: 'I am more excited by future possibilities than by what is immediately in front of me.', dimension: 'SN', reverse: false, section: 2 },
  { id: 'ty_sn_08', text: 'I tend to trust what has been proven to work over untested new approaches.', dimension: 'SN', reverse: true, section: 2 },

  // ── Section 3: Decisions & Values (TF axis) ────────────────────────────────
  // higher score = Feeling (F)
  { id: 'ty_tf_01', text: 'When making a decision, I consider how it will affect people before anything else.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_02', text: 'I am more comfortable with logical analysis than with navigating emotional dynamics.', dimension: 'TF', reverse: true, section: 3 },
  { id: 'ty_tf_03', text: 'I find it important that decisions feel fair and considerate, not just efficient.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_04', text: 'I prioritize objective truth over keeping the peace in a disagreement.', dimension: 'TF', reverse: true, section: 3 },
  { id: 'ty_tf_05', text: 'I am sensitive to the emotional tone in a room, even when nothing is said directly.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_06', text: 'I would rather give honest feedback than soften it to protect someone\'s feelings.', dimension: 'TF', reverse: true, section: 3 },
  { id: 'ty_tf_07', text: 'Making someone feel seen and understood matters more to me than solving their problem.', dimension: 'TF', reverse: false, section: 3 },
  { id: 'ty_tf_08', text: 'I tend to evaluate ideas on their merit rather than on how the person delivering them feels.', dimension: 'TF', reverse: true, section: 3 },

  // ── Section 4: Structure & Flow (JP axis) ──────────────────────────────────
  // higher score = Perceiving (P)
  { id: 'ty_jp_01', text: 'I prefer to keep plans flexible so I can respond to what comes up.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_02', text: 'I feel more comfortable when I have a clear schedule and know what to expect.', dimension: 'JP', reverse: true, section: 4 },
  { id: 'ty_jp_03', text: 'I often start projects without a firm plan, figuring things out as I go.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_04', text: 'I like to reach a decision and close it off rather than keep weighing options.', dimension: 'JP', reverse: true, section: 4 },
  { id: 'ty_jp_05', text: 'I feel energized by open questions and possibilities, even unresolved ones.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_06', text: 'I find it satisfying to cross things off a list and move forward with a plan.', dimension: 'JP', reverse: true, section: 4 },
  { id: 'ty_jp_07', text: 'I resist committing too early because I want to keep my options open.', dimension: 'JP', reverse: false, section: 4 },
  { id: 'ty_jp_08', text: 'Ambiguity and last-minute changes are genuinely stressful for me.', dimension: 'JP', reverse: true, section: 4 },
];
