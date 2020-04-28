<template>
  <footer class="footer">
    <div class="container app-container">
      <div class="content has-text-centered">
        <div class="level">
          <div class="level-left author">
            <div class="author-description">
              Created by by
              <a href="https://twitter.com/modularcoder">
                <strong>Gev Harutyunyan</strong>
              </a>
            </div>
            <div>
              <a href="https://twitter.com/modularcoder" class="badge-link">
                <img
                  alt="Twitter Follow"
                  src="https://img.shields.io/twitter/follow/modularcoder?label=Follow%20me%20on%20Twitter&style=social"
                />
              </a>

              <a
                href="https://github.com/modularcoder/git-pixels/stargazers"
                class="badge-link"
              >
                <img
                  alt="GitHub stars"
                  src="https://img.shields.io/github/stars/modularcoder/git-pixels?label=Star%20the%20Project&style=social"
                />
              </a>
            </div>
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

.author {
  flex-direction: column;
  align-items: flex-start;
}

.author-description {
  margin-bottom: 10px;
}

.badge-link {
  margin-right: 0.7rem;
}
</style>
