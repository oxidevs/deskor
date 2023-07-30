<template>
  <div class="flex h-screen w-screen justify-end">
    <!-- <div class="flex gap-1 p-1">
      <button
        v-for="wv of getAvailabeWidget"
        :key="wv.name"
        class="flex aspect-square w-16 select-none items-center justify-center rounded"
        :class="[wv.isVaild ? 'bg-gray-300' : 'bg-gray-400']"
        @click="wv.isVaild && mount(wv.name)"
      >
        {{ wv.name }}
      </button>
    </div> -->
    <div
      @resize="containerResize"
      class="flex h-full w-[300px] flex-col justify-between space-y-3 p-2"
    >
      <div
        :ref="`wv-${wv.name}`"
        :id="wv.name"
        v-for="wv of Object.values(mounts)"
        :key="wv.name"
        class=""
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { widgets: [], mounts: {} };
  },
  mounted() {
    // 300
    // #fdba74
    // 400
    // #fb923c

    electronAPI.loadPlugins((evt, widgets, usedList) => {
      this.widgets = widgets.map((a) => {
        return {
          name: a.name,
          isVaild: a.isVaild,
          // rect: {},
        };
      });
      usedList.forEach((w) => {
        this.mount(w);
      });
    });

    electronAPI.getContainerRect(this.getContainerRect);
  },
  methods: {
    getContainerRect(evt, data) {
      console.log(data);

      const el = this.$refs[`wv-${data?.name}`];
      const rect = el.getBoundingClientRect();

      el.style.height = `${data ? data.height : 0}px`;

      electronAPI.setContainerRect({
        name: data?.name,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: data.height,
      });
    },
    mount(name) {
      this.mounts[name] = this.widgets.find((w) => w.name === name);

      electronAPI.mountPlugin(name, () => {
        console.log("mounted!!");
      });
    },
  },
  computed: {
    getAvailabeWidget() {
      return this.widgets.filter((w) => {
        return !Object.keys(this.mounts).includes(w.name);
      });
    },
  },
  components: {},
};
</script>
