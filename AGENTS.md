<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Poster layouts are designed on a 1080-wide canvas (ratio 9:16..1:1) and scaled by designBox() in Poster.tsx; never hand-tune layouts per export size. Why: guarantees no clipping/overlap on any platform size.
- Layout decorations go through <Decor> so users can control their strength/colour.
- Each collage portrait uses its own size, position, tone, outline and shadow fields; secondSpeaker maps the second set into the shared Photo renderer. Why: editing one speaker must never move or restyle the other.
- Background removal runs in the browser via @imgly/background-removal (lazy-imported); article-to-poster text uses a createServerFn in src/lib/poster/news.functions.ts. Why: cutouts stay private/free, AI key stays server-side.
