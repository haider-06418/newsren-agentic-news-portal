# Editorial Navy design refresh

The Phase 4 prototype now uses a professional newsroom visual system designed
to improve hierarchy, readability, and use of screen space without adding
runtime or cloud dependencies.

## Palette

- Warm white (`#FAFAF7`) — primary reading canvas
- Deep navy (`#102A43`) — masthead, hierarchy, and high-confidence structure
- Editorial red (`#B4232A`) — live signals, section labels, and uncertainty cues
- News blue (`#245B8A`) — links, context, and interactive affordances
- Slate (`#5B6573`) — supporting copy and metadata
- Divider (`#D9DEE5`) — rules and boundaries

Red is intentionally restrained. It signals attention; it does not compete
with the reporting. Navy carries the brand and reading hierarchy, while blue
identifies paths into evidence and context.

## Layout and typography

- The desktop canvas expands to 1440 px with stronger editorial rules.
- The lead briefing uses a larger serif headline and a more prominent feature.
- Brief cards use a two-column reading-room grid for wider headlines and decks.
- Supporting copy is larger, with fewer labels below 10 px.
- Story pages use a wider reading column and a 340 px assistant rail.
- Ask Newsren has a distinct navy header and remains a supporting sidebar tool.
- Tablet and mobile layouts collapse to one column without horizontal overflow.

## Scope

This is a code-native CSS and SVG refresh. It introduces no external font,
image, analytics, model-hosting, or deployment dependency. The prototype
continues to run locally and remains publishable through the existing workflow.
