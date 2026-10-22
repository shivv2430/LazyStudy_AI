/**
 * Realistic academic study notes for one-click testing
 */

export const SAMPLE_NOTES = [
  {
    id: 'cs-os',
    title: 'Computer Science: Operating Systems & Deadlocks',
    tag: 'Computer Science',
    content: `# Operating Systems: Deadlock Conditions and Resolution

A deadlock in concurrent computing is a condition where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.

## The Four Coffman Conditions
For a deadlock to occur, four conditions must hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time).
2. Hold and Wait: A process must currently hold at least one resource and be requesting additional resources being held by other processes.
3. No Preemption: Resources cannot be forcibly preempted from a process holding them; they can only be released voluntarily after the process completes its task.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain (P0 waits for P1, P1 waits for P2 ... Pn waits for P0).

## Deadlock Handling Strategies
- Deadlock Prevention: Invalidate at least one of the four Coffman conditions by system design (e.g., ordering resource acquisition to eliminate circular wait).
- Deadlock Avoidance: The operating system dynamically evaluates resource allocation state using algorithms like Dijkstra's Banker's Algorithm to ensure the system remains in a "safe state".
- Detection and Recovery: Allow deadlocks to occur, periodically execute a resource allocation graph cycle-detection algorithm, and recover via process termination or selective resource preemption.
- The Ostrich Algorithm: Stick your head in the sand and ignore the problem if deadlocks occur rarely and prevention is computationally expensive (used in many general-purpose OS kernels).`,
  },
  {
    id: 'bio-respiration',
    title: 'Biology: Cellular Respiration & ATP Synthesis',
    tag: 'Biology',
    content: `# Cellular Respiration and Energy Production

Cellular respiration is the metabolic pathway through which cells break down glucose to produce Adenosine Triphosphate (ATP), carbon dioxide, and water.

## Primary Stages of Cellular Respiration

1. Glycolysis
- Occurs in the cytoplasm (cytosol).
- Anaerobic process: does not require oxygen.
- 1 molecule of Glucose (6C) is cleaved into 2 molecules of Pyruvate (3C).
- Net yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH.

2. Pyruvate Oxidation (Link Reaction)
- Pyruvate is transported into the mitochondrial matrix.
- Each pyruvate is converted to Acetyl-CoA, producing 1 NADH and releasing 1 molecule of CO2 per pyruvate.

3. The Citric Acid Cycle (Krebs Cycle)
- Occurs in the mitochondrial matrix.
- Acetyl-CoA combines with Oxaloacetate (4C) to form Citrate (6C).
- Yield per glucose (two turns): 2 ATP/GTP, 6 NADH, 2 FADH2, and 4 CO2.

4. Oxidative Phosphorylation & Electron Transport Chain (ETC)
- Located on the inner mitochondrial membrane (cristae).
- High-energy electrons from NADH and FADH2 are transferred along protein complexes (Complex I-IV).
- Energy released pumps protons (H+) from the matrix into the intermembrane space, creating an electrochemical proton gradient.
- Chemiosmosis: Protons flow back down their gradient through ATP Synthase, driving the phosphorylation of ADP to ATP.
- Oxygen serves as the final electron acceptor, combining with electrons and protons to form H2O.
- Approximate net ATP yield per glucose: 30 to 32 ATP.`,
  },
  {
    id: 'psych-memory',
    title: 'Psychology: Atkinson-Shiffrin & Working Memory Models',
    tag: 'Psychology',
    content: `# Human Memory: Multi-Store and Working Memory Models

Memory is the cognitive system responsible for encoding, storing, and retrieving information.

## The Atkinson-Shiffrin Multi-Store Model (1968)
Proposes that memory consists of three discrete sequential structural components:
1. Sensory Memory:
   - Holds sensory input for brief fractions of a second (iconic memory for visual: ~0.5s; echoic memory for auditory: 2-3s).
   - High capacity but rapid decay unless attended to.
2. Short-Term Memory (STM):
   - Limited capacity: Miller's Law (7 ± 2 items), modern estimates suggest ~4 items without chunking.
   - Duration: 18-30 seconds without rehearsal.
   - Information lost through decay or displacement.
3. Long-Term Memory (LTM):
   - Theoretically infinite storage capacity and permanent duration.
   - Encoded semantically. Subdivided into Declarative (Explicit) and Non-declarative (Implicit) memory.

## Baddeley & Hitch Working Memory Model (1974)
Replaced the unitary short-term memory store with a multi-component dynamic system:
- Central Executive: The attentional control system coordinating slave systems, focusing attention, and switching cognitive tasks.
- Phonological Loop: Handles verbal and acoustic information; divided into the phonological store ("inner ear") and articulatory rehearsal process ("inner voice").
- Visuospatial Sketchpad: Stores and manipulates spatial and visual information ("mind's eye").
- Episodic Buffer (added in 2000): Integrates visual, spatial, and verbal information with chronological ordering and links to long-term memory.`,
  },
];
