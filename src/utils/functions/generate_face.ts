const generate_face = (): string => {
    const emtics = ["⊙﹏⊙", "(●´⌓`●)", "(・_・;)", "(￣ヘ￣;)", "(；^ω^）", "(´-﹏-`；)", "(٥↼_↼)", "(・–・;)ゞ", "(╬☉д⊙)⊰⊹ฺ"];
    return emtics[Math.floor(Math.random() * emtics.length)];
}

export default generate_face;
