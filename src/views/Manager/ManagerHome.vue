<template>
  <div class="about">
    <v-header />
    <v-sidebar />
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <v-tags></v-tags>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <keep-alive :include="tagsList">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "../../components/Header";
import vSidebar from "./ManagerSidebar";
import vTags from "../../components/Tags.vue";

export default {
  name: "ManagerHome",
  computed: {
    tagsList() {
      return this.$store.state.tagsList.map(item => item.name);
    },
    collapse() {
      return this.$store.state.collapse;
    }
  },
  components: {
    vHeader,
    vSidebar,
    vTags,
  }
}
</script>

<style scoped>

</style>