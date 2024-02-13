<script lang="ts" setup></script>

<template>
  <div class="my-8 flex flex-col gap-y-12 overflow-auto [&>section>h2]:mb-4">
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">Source Color</h2>
      <p>
        The single color that’s extracted to define all five key colors is called a source color. While
        it may not be needed in code, it’s a useful distinction for understanding that a dynamic color
        scheme has its root in one initiating color, AKA hue, chroma, and tone. Key colors are defined
        in relationship to the source color’s hue.
      </p>
    </section>
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">Extended Color</h2>
      <p>
        A color specified (in addition to key colors) in order to fill color roles for custom schemes.
        Extended color is a category for idiosyncratic color roles and applications, such as brand
        expression or conventional (semantic) meanings.
      </p>
    </section>
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">Dynamic Color</h2>
      <p>
        Dynamic color is reflected in apps that accept user-generated schemes as inputs for color roles
        in an app. Dynamic color isn’t simply the output of the Material Theme Builder, or an
        algorithmic color scheme, but is the presence of a changeable color role that renders an app’s
        appearance dynamic in response to user input.
      </p>
    </section>
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">Key Color</h2>
      <p>
        A key color is not an extracted color–it’s a derivation of the source color. Key colors are a
        concept useful to understanding dynamic color, but are not used in code. The term describes any
        color that undergoes hue and chroma transformation of a source color. A key color is the basis
        for a tonal palette.
      </p>
    </section>
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">Tonal Palette</h2>
      <p>
        A tonal palette comprises a 13-tone range that serves as the basis for mapping tones to specific
        roles. A tonal palette offers variations in tonality so that a color scheme automatically
        provides contrast and visual differentiation within any color group, such as primary.
      </p>
    </section>
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">HCT</h2>
      <p>
        HCT is an abbreviation of hue, chroma, tone. It’s the name of the color space that enables
        dynamic color. HCT is based on CAM16 hue and chroma; the L* construct for luminance from L*a*b*
        (CIELAB, 1976) is denoted as T for tone.
      </p>
    </section>
    <section>
      <h2 class="mb-2 text-title-lg leading-none text-on-surface-variant">Scheme</h2>
      <p>
        Any mapping of color roles to specific tones from a tonal palette. Schemes consist of multiple
        color roles. A dark scheme informally describes a group of colors using the tones from a group
        of palettes that are mapped for a dark theme.
      </p>
    </section>
  </div>
</template>

<style scoped></style>
