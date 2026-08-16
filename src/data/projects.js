/**
 * Projects index.
 *
 * Add entries at the top: the page reads this array in order. Every field
 * except `id`, `title` and `summary` is optional; the card degrades cleanly
 * when one is missing.
 *
 *   id          Part number shown in the card gutter. Keep the PRJ-00n format.
 *   title       Project name.
 *   year        String, so ranges like "2024 to 25" work.
 *   disciplines Any of DISCIPLINES below. Drives the filter chips.
 *   summary     One or two sentences. This is the card body.
 *   note        Optional serif one liner, the editorial aside under the title.
 *   stack       Tools, languages, materials, processes.
 *   status      "Live" | "Complete" | "In progress" | "Archived" | "Case study soon"
 *   href        Optional external link. Opens in a new tab automatically, and
 *               takes precedence over the project's own page when both exist.
 *   role        Optional, shown in structured data.
 *   media       Optional figure drawn inside the card: { src, poster, width,
 *               height, caption }. A .mp4 src plays on scroll; anything else
 *               renders as a still. Keep width/height the file's real pixel
 *               size so the frame reserves the ratio and the card doesn't jump.
 *               Add `frame` (a CSS ratio, e.g. "4 / 3") with `fit: "contain"`
 *               when the source shape isn't the shape the plate should be —
 *               a portrait render standing in a landscape frame, say.
 *   slug        Required alongside `detail`: the URL at /projects/<slug>.
 *   detail      Optional project page. Presence of this field is what builds
 *               the page and links the card to it:
 *                 lede       One serif line under the title.
 *                 specs      [{ name, value }], the field block down the side.
 *                 sections   [{ heading, body: [paragraph, ...] }], numbered
 *                            on the page in the order given.
 *                 figures    [{ src, poster, width, height, caption }] as for
 *                            `media`. The first is the hero under the header.
 *                 documents  [{ title, kind, meta, href, description, cover,
 *                            coverWidth, coverHeight }]. Files live in
 *                            /public/docs, covers in /public/media.
 */

export const DISCIPLINES = ["Software", "Mechanical", "Mechatronics"];

/**
 * Where a card points. An external `href` wins, then the project's own page,
 * and an entry with neither renders as a plain block rather than a dead link.
 */
export function projectHref(project) {
  if (project.href) return project.href;
  return project.detail && project.slug ? `/projects/${project.slug}` : "";
}

/** The projects that have a page of their own, in index order. */
export function detailedProjects() {
  return projects.filter((p) => p.detail && p.slug);
}

export const projects = [
  {
    id: "PRJ-008",
    slug: "vision-aided-rocket-landing",
    title: "Vision Aided Rocket Landing GNC",
    year: "2026",
    disciplines: ["Software", "Mechatronics"],
    role: "Simulation, estimation and control",
    summary:
      "A simulated guidance, navigation and control stack for a small rocket flying a powered landing. IMU, optical flow, radar altimeter and GPS are fused in an error state Kalman filter, an LQG controller closes the loop, and the full descent is visualised in Foxglove with live thrust vectoring and truth against estimate tracking.",
    note: "Landing a rocket on an estimated state.",
    stack: ["Python", "Error state Kalman filter", "LQG control", "Foxglove"],
    status: "In progress",
    href: "",
    media: {
      src: "/media/rocket-landing.mp4",
      poster: "/media/rocket-landing.jpg",
      width: 1440,
      height: 786,
      caption:
        "A landing replayed in Foxglove: tracked descent, gimbal angles, thrust and descent rate, with estimate drawn against truth.",
    },
    detail: {
      lede: "A rocket that has to land itself, flying the whole descent on a state it can only estimate.",
      specs: [
        { name: "Estimator", value: "Error state Kalman filter" },
        { name: "Control", value: "LQG" },
        { name: "Sensing", value: "IMU, optical flow, radar altimeter, GPS" },
        { name: "Actuation", value: "Thrust vectoring" },
        { name: "Telemetry", value: "MCAP, replayed in Foxglove" },
        { name: "Language", value: "Python" },
      ],
      sections: [
        {
          heading: "The loop",
          body: [
            "The simulation flies a small rocket through a powered descent to touchdown, with the full guidance, navigation and control stack in the loop. Nothing that flies the vehicle is allowed to see the truth: the sensors are what the filter gets, the filter's estimate is what the controller acts on, and the true trajectory exists only so the two can be drawn against each other after the fact.",
            "That separation is the whole point of building it this way. An estimator tested on its own looks good in isolation, and a controller given perfect state always flies well. Run them together and the errors compound in the way they would on real hardware: estimator lag becomes control effort, and control effort moves the vehicle the estimator is trying to track.",
          ],
        },
        {
          heading: "Navigation",
          body: [
            "Four sensors are fused, chosen because they fail in different ways. The IMU carries the state forward at high rate and drifts. The radar altimeter fixes height above the ground directly. Optical flow measures lateral motion once the ground is close enough to resolve texture. GPS bounds absolute position at a slower rate and with coarser precision. Any one of them alone is insufficient for a landing; together they cover each other.",
            "The fusion runs as an error state Kalman filter, which tracks the small correction to a nominal trajectory rather than the trajectory itself. Attitude is the reason this matters: keeping the error in a minimal three parameter form, and folding it back into the nominal quaternion after every update, avoids the singularity and normalisation problems that a filter carrying attitude directly runs into.",
          ],
        },
        {
          heading: "Guidance and control",
          body: [
            "The loop is closed with an LQG controller, the pairing of a linear quadratic regulator with a Kalman estimator, commanding throttle and thrust vector angles. In the recording the thrust trace sits around 250 N through most of the descent and steps up for the flare, and both gimbal axes hold near zero with small corrections either side, which is what a vehicle tracking a descent profile rather than fighting one looks like.",
          ],
        },
        {
          heading: "Reading the descent",
          body: [
            "Everything the run produces is logged to MCAP and replayed in Foxglove. The 3D panel carries the vehicle, its gimbal and the landing plane, tracked from the outside so the attitude is legible; the plots beside it carry thrust, descent rate, translation and rotation. Translation is drawn twice, estimate against truth, so the navigation error is a visible gap on the same axes rather than a number in a log.",
            "Building the visualisation as part of the simulation rather than after it changed how the work went. A filter that has diverged looks obviously wrong on a 3D view seconds before it shows up in a residual plot, and a controller chattering on the gimbal is something you see immediately.",
          ],
        },
      ],
      figures: [
        {
          src: "/media/rocket-landing.mp4",
          poster: "/media/rocket-landing.jpg",
          width: 1440,
          height: 786,
          caption:
            "The full descent replayed in Foxglove: 3D tracking view and gimbal angles on the left, thrust and descent rate above, translation and rotation below with estimate drawn against truth.",
        },
      ],
    },
  },
  {
    id: "PRJ-001",
    slug: "convoii",
    title: "Convoii",
    year: "2025",
    disciplines: ["Software"],
    role: "Solo founder and developer",
    summary:
      "A cross platform mobile app for real time proximity voice communication between motorcyclists, with open comms for nearby riders and private crew channels. I designed and built the whole thing: the app, the interface, the icon pipeline, and the product strategy around a cold start density problem.",
    note: "Proximity voice comms for motorcyclists.",
    stack: ["React Native", "TypeScript", "LiveKit", "Node.js"],
    status: "In progress",
    href: "",
    media: {
      src: "/media/convoii-render.jpg",
      width: 852,
      height: 1846,
      frame: "4 / 3",
      fit: "contain",
      // Sampled off the render's own edges, so the pillarbox doesn't read as
      // a lighter box sitting on the plate.
      background: "#121211",
      caption:
        "Open comms mid ride: riders in range placed by proximity around a live channel.",
    },
    detail: {
      lede: "Riders who end up near each other end up on the same channel. No pairing, no push to talk, no one deciding who is in the conversation.",
      specs: [
        { name: "Client", value: "React Native 0.73, TypeScript" },
        { name: "State", value: "Zustand" },
        { name: "Voice", value: "LiveKit SFU over WebRTC" },
        { name: "Backend", value: "Node, Express and ws on one port" },
        { name: "Matcher", value: "Geohash index, union find, hysteresis" },
        { name: "Accounts", value: "Supabase auth and Postgres, RLS enforced" },
        { name: "Native", value: "Android Kotlin: BLE, IMU, foreground service" },
        { name: "Platform", value: "Android first, iOS to follow" },
      ],
      sections: [
        {
          heading: "The idea",
          body: [
            "Motorcycle intercoms make you decide who you are riding with before you ride, then hold that decision in a pairing. Convoii inverts it. A rider opens the app, starts a ride, and from then on the group is whatever the road makes it: riders who fall in alongside you are on the channel, riders who peel off leave it, and nobody presses anything to talk.",
            "That puts almost all of the difficulty in one place. Deciding who is in a conversation, continuously, from noisy GPS on moving vehicles, is the actual product, and most of the engineering below exists to make that decision stable enough to speak over.",
          ],
        },
        {
          heading: "Matching riders",
          body: [
            "Riders push presence to the backend, which holds it for 90 seconds and indexes it by geohash, at a cell size chosen so the ring of neighbouring cells covers the furthest distance a link can survive. Each tick, links between compatible riders are fed into a union find, and the connected components are the groups. A component of two or more becomes a channel.",
            "Naive distance thresholding fails immediately on a real road, so three rules sit on top. Distance is hysteretic: riders pair at 150 m but stay paired out to 300 m, so ordinary spacing in traffic does not flap the channel open and closed. New links also need agreeing headings, but only when both riders are actually moving, which is what keeps a divided highway, a crossroads or a petrol station from putting you on a channel with oncoming traffic. Retained links deliberately skip that check, because an overtake or a weave should never drop audio mid sentence.",
            "Channel ids are sticky. A group keeps its id as it moves, the older id wins when two groups merge, and on a split the id follows deterministically, so a crew riding together stays on one channel for a whole ride instead of being rejoined every few minutes. Group membership is recomputed at most every 500 ms and shared by every rider in that window, so a dense pack is solved once per tick rather than once per rider.",
            "Blocking is enforced at the channel rather than the link. Severing the direct link is not enough, because a mutual friend in the middle would still pull a blocked rider into the same component and therefore the same audio, so a channel containing a blocked rider is declined outright.",
          ],
        },
        {
          heading: "Voice",
          body: [
            "Voice started as a WebRTC mesh, which capped a channel at about four riders before every phone was uploading its microphone to everyone else. It now runs through an SFU: a proximity channel maps one to one onto a LiveKit room, so a rider uploads their microphone once no matter how many people are on the channel, and the media never touches the backend, which only mints a token scoped to that one room.",
            "That swap was survivable because voice sits behind a single interface. The ride orchestration only ever calls join, leave and mute against the current channel id, so replacing the mesh with an SFU was a new module and a token endpoint rather than a rewrite. Relay credentials are short lived and derived from a shared secret, so no permanent relay password ships inside the app.",
            "Channel assignment is pushed to the client over its own socket rather than polled, and only when the assignment actually changes, which takes the polling round trip out of how long it takes to be able to hear someone.",
          ],
        },
        {
          heading: "On the phone",
          body: [
            "A rider is wearing gloves and a helmet at 100 km/h, so the phone side is mostly native. Kotlin modules advertise and scan a Bluetooth LE beacon carrying the rider's id, watch for the helmet connecting and for the audio route changing, and play the join chime through the voice communication path so it rides the Bluetooth link into the helmet rather than out of the phone speaker into the wind. A vibration pattern doubles it up for anyone riding without audio.",
            "A foreground service holds the process, and with it GPS, BLE, the presence socket and the audio session, alive while the phone is in a pocket, and widens its declared service types as permissions are granted. A second native module streams accelerometer and gyroscope, which turns into a ride summary afterwards: a speed profile, and lean angle recovered from the accelerometer's roll.",
          ],
        },
        {
          heading: "Accounts and crews",
          body: [
            "Riders sign in with a phone number, Google or Facebook, and pick a callsign that doubles as their identity to the matcher, so the name on the channel and the key in the index are the same string. Auth and data are Supabase, reached through plain authenticated fetches rather than a client library, with row level security doing the access control rather than trusted client code.",
            "Alongside open comms there are crews: a private channel that only links riders who share the same crew, invited by a QR code or a link that deep links straight into joining. It is the same matcher underneath, with membership as one more condition on whether two riders are allowed to link at all.",
          ],
        },
      ],
      figures: [
        {
          src: "/media/convoii-render.jpg",
          width: 852,
          height: 1846,
          // Shown at its own portrait shape and capped in width, so the render
          // fills its plate edge to edge instead of floating in a wide frame.
          maxWidth: 420,
          caption:
            "Open comms during a ride: riders in range placed around the live channel by distance, with the callsign, connection state and range of each one underneath.",
        },
      ],
    },
  },
  {
    id: "PRJ-002",
    slug: "gnn-mechanical-health-monitoring",
    title: "GNN for Mechanical Health Monitoring",
    year: "2026",
    disciplines: ["Software", "Mechatronics"],
    role: "Thesis",
    summary:
      "My thesis. A graph neural network approach to health monitoring of robotic systems, modelling mechanical components and the interactions between them so degradation and faults show up before they become failures.",
    note: "Teaching a network the shape of a machine.",
    stack: ["Python", "PyTorch", "Graph Neural Networks", "ROS 2"],
    status: "Complete",
    href: "",
    media: {
      src: "/media/gnn-inference.jpg",
      width: 1440,
      height: 786,
      caption: "Live diagnosis in ROS 2: a fault called in on one joint, the network's answer beside it.",
    },
    detail: {
      lede: "A robot is a graph. The question was whether a diagnostic should be handed that structure, or made to work it out.",
      specs: [
        { name: "Type", value: "Undergraduate thesis, UNSW Sydney" },
        { name: "Supervisor", value: "Dr. Ang Liu" },
        { name: "Platform", value: "Simulated 6 DoF manipulator, UR5e kinematics" },
        { name: "Model", value: "Spatio temporal GNN, PyTorch" },
        { name: "Pipeline", value: "ROS 2, ONNX runtime" },
        { name: "Protocol", value: "9 variants, 3 seeds, run aware splits" },
      ],
      sections: [
        {
          heading: "The question",
          body: [
            "Joints and links form a kinematic chain, sensors attach to components, and disturbances travel along physical connections - so a robot, topologically speaking, is a graph! Graph neural networks are established for structural and machinery health monitoring, but almost nothing had been published on multi joint robots, and nothing at all had put the robot's own configuration into the diagnostic.",
            "The thesis tests two ways structural knowledge could enter the model. The first gates the graph's connectivity on joint configuration, so that which components are considered connected depends on the pose the arm is in. The second stops assuming the joint to sensor coupling is known at all and learns it, using the learned coupling to attribute a fault back to the joint that caused it. Both were posed as open questions rather than foregone conclusions, and the experiment was built so a null result would be as attributable as a positive one.",
          ],
        },
        {
          heading: "The corpus",
          body: [
            "There is no public fault dataset for instrumented manipulators, so the first deliverable was a ROS 2 pipeline that generates one. Six nodes take a trajectory curriculum through fault modulated sensor synthesis to labelled graph snapshots on disk: single joint sweeps, coordinated pairs and whole arm motion, each crossed with three speed and three payload scales.",
            "Six fault modes are injected analytically, four mechanical and two in the instrumentation, with mechanical faults attenuating along the chain so a fault at the elbow leaves a decayed imprint at the wrist and shoulder. The scheduler enumerates every joint against every fault type against every severity, so no cell of that space can be missing from a long enough recording. Twelve sessions were recorded, and every sample is stamped with the session that produced it.",
            "That stamp is what makes the numbers mean anything. With a window of 16 and a stride of 4, neighbouring windows share twelve of their sixteen snapshots, so a naive shuffle puts near duplicates of training windows into the test set and measures memorisation. Splitting by whole recording session instead keeps every window from a session on one side of the split, and normalisation statistics are computed from the training partition alone.",
          ],
        },
        {
          heading: "The models",
          body: [
            "Nine variants share one experimental design. Two baselines mark the ends: a non graph MLP that never mixes information between nodes, and a graph attention network that learns edge weights implicitly over the structural mask. Four spatio temporal GNNs form a 2x2 over pose conditioning and a learned residual on the adjacency, so each factor's marginal effect can be read straight off the matrix, with a spectral feature probe added to rule out feature poverty as an explanation for any null.",
            "The last two variants carry the primary contribution: a learned coupling matrix that predicts each sensor's embedding from the joints it couples to. A self supervised penalty holds that reconstruction tight on healthy data, so a fault, which breaks the normal joint to sensor relationship, spikes residual energy at exactly the sensors coupled to the faulted joint, and scattering that energy back through the coupling localises it.",
          ],
        },
        {
          heading: "What came out",
          body: [
            "Pose conditioning returned a clean null. It improved neither classification nor localisation, on any graph, at any window size. A single seed pilot had shown a gain; under a three seed protocol it vanished, which is why the protocol changed and why the result is reported in full rather than buried. What the mechanism does leave behind is one interpretable number: the converged bandwidth, which says how strongly configuration gates transmission through this arm, and which settles well below its initialisation.",
            "The learned coupling was the opposite. It localises faults at 0.95 in distribution, and at roughly 0.79 when the sensor mounting is withheld from the model entirely, the retrofit case where sensors are added to an existing machine without a verified map of what observes what. Every fixed graph and non graph baseline collapses to chance there. It also recovers the true coupling at 0.97 correlation, so training yields an inspectable map of which sensors observe which joints as a by product.",
            "Underneath both answers sits the most robust finding of the study: structure is necessary for localisation, not for classification. The non graph baseline classifies faults competitively at 0.934 and localises at 0.168, which is chance across six joints, while every graph variant clears 0.88. The graph does not tell you what the fault is any better. It is what lets the system say where.",
          ],
        },
        {
          heading: "Running live",
          body: [
            "The best checkpoint exports to ONNX and runs inside a ROS 2 node, buffering a sliding window of incoming snapshots, applying the stored training normalisation and publishing a diagnosis every tick with per joint scores and its own measured latency. Inference sits under a millisecond on CPU against the 50 ms budget of the 20 Hz tick, so the same schema flows unchanged from the simulator through training to live diagnosis.",
          ],
        },
      ],
      figures: [
        {
          src: "/media/gnn-inference.mp4",
          poster: "/media/gnn-inference.jpg",
          width: 1440,
          height: 786,
          caption:
            "Live inference in ROS 2. A structural weakening fault is called in on the elbow at 0.9 severity through the fault service on the right, while the diagnosis topic underneath publishes fault state, confidence, per joint scores and inference latency each tick.",
        },
      ],
      documents: [
        {
          title: "Mechanical Health Monitoring of Robotic Systems Using Graph Neural Networks",
          kind: "PDF",
          meta: "48 pages · 1.9 MB",
          href: "/docs/kane-jackson-gnn-thesis.pdf",
          description:
            "The full thesis: where the work sits in the literature, the simulation pipeline and graph schema, the nine model variants and the multi seed results, including the negative one.",
          cover: "/media/thesis-cover.jpg",
          coverWidth: 900,
          coverHeight: 1165,
        },
      ],
    },
  },
  {
    id: "PRJ-003",
    title: "Cycloidal Drive and Robot Arm",
    year: "2025",
    disciplines: ["Mechanical", "Mechatronics"],
    role: "Design and build",
    summary:
      "A dual disc cycloidal drive designed from first principles, as the basis for a 4 to 5 DoF robot arm. The drawing on the home page is generated from this design: the disc profile, pin ring and reduction are all computed from its real parameters. Drive built, arm next.",
    note: "The drive the home page is drawn from.",
    stack: ["CAD", "Mechanical design", "Kinematics"],
    status: "In progress",
    href: "",
    media: {
      src: "/media/cycloidal-drive-render.png",
      width: 577,
      height: 521,
      frame: "4 / 3",
      fit: "contain",
      // The render's own flat ground, so the frame reads as one surface.
      background: "#080c12",
      caption: "The drive assembled: bolted output flange on top, motor at the base.",
    },
  },
  {
    id: "PRJ-004",
    title: "Table Tennis Computer Vision",
    year: "2024",
    disciplines: ["Software"],
    summary:
      "A real time ball tracking system using HSV filtering and motion analysis to measure ball speed accurately from ordinary video.",
    note: "Tracking a 40mm ball at speed.",
    stack: ["Python", "OpenCV"],
    status: "Archived",
    href: "",
  },
  {
    id: "PRJ-005",
    title: "Stockman",
    year: "2024",
    disciplines: ["Software"],
    summary:
      "A full stack inventory management system with complete CRUD functionality and a clean interface, plus a web scraper that automates product data collection.",
    note: "Stock management, end to end.",
    stack: ["React.js", "Node.js", "MongoDB", "Tailwind"],
    status: "Archived",
    href: "",
  },
  {
    id: "PRJ-006",
    title: "Click and Collect Valet",
    year: "2023",
    disciplines: ["Software"],
    summary:
      "A real time order management system deployed in a working retail environment, handling up to 12 concurrent valets and hundreds of orders a day.",
    note: "Built for a live shop floor.",
    stack: ["JavaScript", "Firebase", "HTML", "CSS"],
    status: "Live",
    href: "https://officeworkscollect.web.app",
  },
  {
    id: "PRJ-007",
    title: "ASCII Ocean",
    year: "2024",
    disciplines: ["Software"],
    summary:
      "A generative ocean rendered entirely in text. 3D simplex noise sampled per character cell and redrawn at 30fps in the browser. It was the background of the previous version of this site, and it now lives on the 404 page.",
    note: "Fluid motion out of a fixed character grid.",
    stack: ["JavaScript", "React", "simplex-noise"],
    status: "Live",
    href: "/this-page-does-not-exist",
  },
];
