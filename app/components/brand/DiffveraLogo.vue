<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    variant?: 'badge' | 'mark'
  }>(),
  {
    size: 32,
    variant: 'badge',
  }
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    :width="size"
    :height="size"
    fill="none"
    role="img"
    aria-label="Diffvera"
  >
    <!-- Dark Charcoal Squircle Badge (Verified Delta: Delta + V Monogram) -->
    <template v-if="variant === 'badge'">
      <rect width="32" height="32" rx="7.5" fill="#151515" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <!-- Left Diff Ascent (Pure White) -->
      <path
        d="M15 6L6.8 22.8C6.5 23.5 7 24.3 7.8 24.3H12.2C12.7 24.3 13.2 24 13.5 23.5L15.8 18.5L15 6Z"
        fill="#FFFFFF"
      />
      <!-- Right Vera Descent (Raycast Coral #ff6363) -->
      <path
        d="M17 6L25.2 22.8C25.5 23.5 25 24.3 24.2 24.3H19.8C19.3 24.3 18.8 24 18.5 23.5L16.2 18.5L17 6Z"
        fill="#FF6363"
      />
      <!-- Delta Base Verification Cross-Strut -->
      <path
        d="M10.8 22.2H21.2C21.7 22.2 22 22.6 21.8 23.1L21.3 24.3H10.7L10.2 23.1C10 22.6 10.3 22.2 10.8 22.2Z"
        fill="#FF6363"
      />
    </template>

    <template v-else>
      <!-- Standalone Mark Variant: Charcoal Left Beam, Coral Right Beam -->
      <path
        d="M15 6L6.8 22.8C6.5 23.5 7 24.3 7.8 24.3H12.2C12.7 24.3 13.2 24 13.5 23.5L15.8 18.5L15 6Z"
        class="fill-ink"
      />
      <path
        d="M17 6L25.2 22.8C25.5 23.5 25 24.3 24.2 24.3H19.8C19.3 24.3 18.8 24 18.5 23.5L16.2 18.5L17 6Z"
        fill="#FF6363"
      />
      <path
        d="M10.8 22.2H21.2C21.7 22.2 22 22.6 21.8 23.1L21.3 24.3H10.7L10.2 23.1C10 22.6 10.3 22.2 10.8 22.2Z"
        fill="#FF6363"
      />
    </template>
  </svg>
</template>
