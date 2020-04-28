<template>
  <footer class="footer">
    <div class="container app-container">
      <div class="content has-text-centered">
        <div class="level">
          <div class="level-left">
            <p>
              <strong>git-pixels</strong> by
              <a href="https://twitter.com/modularcoder"
                ><strong>@modularcoder</strong></a
              >
            </p>
          </div>
          <div class="level-right">
            <b-button
              type="is-text"
              outlined
              tag="a"
              href="https://github.com/modularcoder/git-pixels"
              >View on GitHub</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 3rem 1.5rem 3rem;
}

.github-button {
  height: 36px;
}
</style>
