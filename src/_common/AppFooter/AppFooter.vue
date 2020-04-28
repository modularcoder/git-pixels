<template>
  <footer class="footer">
    <div class="container app-container">
      <div class="content has-text-centered">
        <div class="level">
          <div class="level-left">
            <p>
              <strong>git-pixels</strong> by
              <a href="https://twitter.com/modularcoder">@modularcoder</a>
              <br />
            </p>
          </div>
          <div class="level-right">
            <iframe
              class="github-button"
              src="https://ghbtns.com/github-btn.html?user=modularcoder&repo=git-pixels&type=star&count=true&size=large"
              frameborder="0"
              scrolling="0"
              width="170"
              height="30"
              title="Watch twbs/bootstrap on GitHub"
            ></iframe>
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
}

.github-button {
  height: 36px;
}
</style>
