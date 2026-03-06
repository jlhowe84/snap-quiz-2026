export interface Question {
  category: string;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    category: "New for 2026",
    q: "What is the new Photo Day Check-In App used for?",
    options: [
      "Editing photos on site",
      "Looking up subjects and printing tickets with a receipt printer",
      "Tracking weather conditions",
      "Messaging parents about photo day",
    ],
    correct: 1,
    explanation:
      "The new Check-In App lets coordinators look up players by name or team and instantly print a barcode ticket on a receipt printer.",
  },
  {
    category: "New for 2026",
    q: "What new item will posers and photographers have with them at shoots this season?",
    options: [
      "A tablet with team rosters",
      "Laminated posing guides",
      "A wireless speaker for music",
      "Printed shot lists",
    ],
    correct: 1,
    explanation:
      "Laminated posing guide cards will be at every station as a quick reference for proper poses by sport.",
  },
  {
    category: "Coordinator",
    q: "When a team arrives, what should the coordinator tell them to do FIRST?",
    options: [
      "Line up at the check-in table individually",
      "Go directly to the photo station",
      "Gather together as a team",
      "Find the head coach and wait",
    ],
    correct: 2,
    explanation:
      "Have coaches gather their teams together first. It's much more efficient to hand out slips/tickets to the whole team at once.",
  },
  {
    category: "Coordinator",
    q: "If a coach is on multiple teams, what should you do?",
    options: [
      "Only give them one ticket for their primary team",
      "Tell them to come back later",
      "Give them a separate ticket for each team",
      "Have them share a ticket with another coach",
    ],
    correct: 2,
    explanation:
      "Coaches on multiple teams need a separate ticket/slip for EACH team. No exceptions!",
  },
  {
    category: "Poser",
    q: "How high should the main flash be above the subject's head?",
    options: [
      "6-8 inches",
      "12-18 inches",
      "24-30 inches",
      "It doesn't matter, just set it once",
    ],
    correct: 1,
    explanation:
      "The main flash should ALWAYS be 12-18 inches above the subject's head. This must be adjusted for every player!",
  },
  {
    category: "Poser",
    q: "When a player has their hands on their hips, where should the thumb be?",
    options: [
      "Pointing up",
      "In the front with fingers in back",
      "In the back with fingers in front",
      "Wrapped around the waist",
    ],
    correct: 2,
    explanation:
      "Fingers in FRONT, thumb in BACK. This is a common mistake that looks awkward if done the other way.",
  },
  {
    category: "Photographer",
    q: "What is the correct photo sequence for each player?",
    options: [
      "Individual, then Team, then Buddy",
      "Buddy, then Individual, then Team",
      "Team Photo, then Individual, then Coach/Player or Buddy",
      "Individual, then Coach/Player, then Team",
    ],
    correct: 2,
    explanation:
      "The sequence is: 1) Team Photo, 2) Individual Photo, 3) Coach/Player or Buddy. Always in this order!",
  },
  {
    category: "Photographer",
    q: "Where should the main flash (Flash A) be positioned relative to the background?",
    options: [
      "Directly behind the camera",
      "Lined up with the left corner, about 3 feet in front",
      "On the right side, 5 feet away",
      "Centered above the camera on a boom",
    ],
    correct: 1,
    explanation:
      "Flash A (main light) should be lined up with the left corner of the background, about 3 feet in front. Always sandbag it!",
  },
  {
    category: "Photographer",
    q: "Why should you look OVER the camera instead of through the viewfinder while shooting?",
    options: [
      "It wastes battery",
      "It's slower",
      "So you can watch for blinks and flash misfires",
      "The autofocus works better without it",
    ],
    correct: 2,
    explanation:
      "Since the camera is on a tripod and not moving, look OVER the camera so you can watch for blinks and flash misfires in real time.",
  },
  {
    category: "Quality Focus",
    q: "Which of these is NOT one of the quality issues we're focusing on fixing this season?",
    options: [
      "Catching blinks",
      "Subjects looking away",
      "Using the wrong lens",
      "Sloppy uniforms and chins too high",
    ],
    correct: 2,
    explanation:
      "Our focus areas are: catching blinks, subjects looking away, sloppy uniforms, and chins too high. Lens selection isn't one of the issues.",
  },
  {
    category: "Setup",
    q: "How many stakes must be used to secure the tent?",
    options: [
      "4 (one per corner)",
      "6 (corners plus two sides)",
      "8 (4 feet + 4 guy lines)",
      "As many as you want",
    ],
    correct: 2,
    explanation:
      "All 8 stakes must be fully in the ground.",
  },
  {
    category: "Setup",
    q: "How should the tent be oriented relative to the sun?",
    options: [
      "Sun should shine directly into the tent for lighting",
      "Doesn't matter as long as it's staked",
      "Sun behind or at 45 degrees to either side",
      "Always face north",
    ],
    correct: 2,
    explanation:
      "The sun should be behind the tent or at 45 degrees to either side. It should NEVER be shining directly into the tent.",
  },
  {
    category: "Setup",
    q: "When there are multiple photo stations, what's the golden rule?",
    options: [
      "Each station should use different poses for variety",
      "The lead photographer picks settings for everyone",
      "All stations must be set up identically",
      "Stations should alternate between flash and natural light",
    ],
    correct: 2,
    explanation:
      "Multiple stations must be identical: same distance, camera height, light placement, and exposure settings.",
  },
  {
    category: "General",
    q: "What should you do if a player shows up at the photo station without a ticket or slip?",
    options: [
      "Take their photo anyway",
      "Have them write their name on a sticky note",
      "Direct them back to the check-in table to get one",
      "Skip them and move on",
    ],
    correct: 2,
    explanation:
      "No photo without a slip/ticket! Direct them back to the check-in table. This ensures every photo is properly tracked.",
  },
  {
    category: "General",
    q: "Where should you keep your phone during a photo shoot?",
    options: [
      "In your pocket on silent",
      "Out of sight and out of hand when players/coaches are present",
      "On the table next to the equipment",
      "It's fine to check it between teams",
    ],
    correct: 1,
    explanation:
      "Phones must be out of sight and out of hand if any players or coaches are in the area. Full attention on the job!",
  },
];
