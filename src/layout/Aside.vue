<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :default-active="activeIndex"
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      min-width: fit-content;
    "
  >
    <img
      src="/logo.png"
      style="display: block; margin: auto; width: 40px; padding: 20px 0"
    />

    <!-- Identity strip: avatar + name + role label. Collapsed view shows just
         the avatar circle so the sidebar stays narrow. -->
    <div
      v-if="store.isAuthenticated"
      class="identity-strip"
      :class="{ collapsed: isCollapse }"
    >
      <div class="avatar" :title="store.fullName || store.username">
        {{ avatarInitial }}
      </div>
      <div v-if="!isCollapse" class="identity-meta">
        <div class="identity-name">{{ store.fullName || store.username }}</div>
        <div class="identity-role">{{ roleDisplay }}</div>
      </div>
    </div>

    <el-menu-item @click="toggleCollapse">
      <!-- Dynamically set the icon based on isCollapse state -->
      <img
        :src="currentIcon"
        alt="toggle-icon"
        style="width: 20px; height: 20px"
      />
      <span style="margin-left: 6px">{{ isCollapse ? "展開" : "收合" }}</span>
    </el-menu-item>
    <div style="flex: 1">
      <template v-for="(item, index) in moduleList" :key="index">
        <el-menu-item
          :index="item.url"
          :id="`menu-${index}`"
          @click="() => handleClick(item)"
        >
          <!-- Displaying the icon if available -->
          <img
            v-if="item.icon"
            :src="item.icon"
            alt="icon"
            style="width: 20px; height: 20px"
          />

          <!-- Display the nodeName if not collapsed -->
          <span v-if="!isCollapse" style="margin-left: 20px">
            {{ item.nodeName }}
          </span>
        </el-menu-item>
      </template>
    </div>
    <div style="margin-bottom: 50px">
      <!-- Admin-only menu items (帳號及權限) -->
      <template v-for="(item, index) in moduleBottomList" :key="index">
        <el-menu-item
          :index="item.url"
          :id="`menu-bottom-${index}`"
          @click="() => handleClick(item)"
        >
          <img
            v-if="item.icon"
            :src="item.icon"
            alt="icon"
            style="width: 20px; height: 20px"
          />
          <span v-if="!isCollapse" style="margin-left: 20px">
            {{ item.nodeName }}
          </span>
        </el-menu-item>
      </template>

      <!--
        Logout sits outside the v-for above so it always renders, regardless
        of whether the admin-only menu items are present.
      -->
      <el-menu-item v-if="shouldShowLogout" @click="handleLogout">
        <div class="icon-svg">
          <img
            src="/aside/log-out-regular-24.png"
            style="width: 20px; height: 20px"
          />
          <span v-if="!isCollapse" style="margin-left: 20px">登出</span>
        </div>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { myStore } from "../stores/index";
import { ElMessage } from "element-plus";
import service from "../services/apis";
import { ASIDE_ICONS } from "../dropdownOptions";
import { groupLabel, roleLabel } from "../lib/permissionLabels";
import { usePermissionStore } from "../stores/index";
import { storeToRefs } from "pinia";

const isCollapse = ref(true);
const router = useRouter();
const route = useRoute();
const store = myStore();
// permissionStore.permissions holds the {moduleName}{Read|Write|Delete} flag
// map. We use it to hide sidebar items the user can't even open.
const { permissions: perms } = storeToRefs(usePermissionStore());

// activeIndex needs to track the current route reactively so the highlighted
// menu item updates when the user navigates without remounting the Aside.
const activeIndex = computed(() => route.path);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

// Identity strip helpers.
const avatarInitial = computed(() => {
  const source = store.fullName || store.username || "?";
  return source.charAt(0).toUpperCase();
});
const roleDisplay = computed(() => {
  // Prefer the localised group name (管理員 / 一般使用者 / 唯讀); fall back
  // to the coarse role label if the user has no permission group set.
  return groupLabel(store.roleName) || roleLabel(store.role);
});

/**
 * All sidebar entries the app knows about, each carrying:
 *   url            — vue-router path
 *   nodeName       — Traditional Chinese label
 *   iconKey        — key into ASIDE_ICONS (resolved asynchronously into iconMap)
 *   canShow        — gate function over (permissions, store). The item only
 *                    renders when this returns true.
 *
 * Hiding rather than disabling avoids the "click → 403 → looks like logout"
 * footgun. The router guard mirrors these gates so deep-linking also bounces
 * cleanly.
 */
const MODULE_TOP = [
  {
    url: "/CaseManagement",
    nodeName: "個案管理",
    iconKey: "casemanagement",
    canShow: (p) => !!p.case_managementRead,
  },
  {
    url: "/SponsorManagement",
    nodeName: "補助管理",
    iconKey: "sponsormanagement",
    canShow: (p) => !!p.sponsor_managementRead,
  },
];
const MODULE_BOTTOM = [
  {
    url: "/AccountManagement",
    nodeName: "帳號及權限",
    iconKey: "accountmanagement",
    canShow: (_p, s) => s.isAdmin,
  },
];

// iconMap holds resolved icon URLs keyed by iconKey. Populated once on mount.
const iconMap = ref({});

const moduleList = computed(() =>
  MODULE_TOP
    .filter((m) => m.canShow(perms.value, store))
    .map((m) => ({ ...m, icon: iconMap.value[m.iconKey] }))
);
const moduleBottomList = computed(() =>
  MODULE_BOTTOM
    .filter((m) => m.canShow(perms.value, store))
    .map((m) => ({ ...m, icon: iconMap.value[m.iconKey] }))
);

// Computed property for the current icon
const currentIcon = ref(null);

const updateIcon = async () => {
  const iconKey = isCollapse.value ? "chevronRight" : "chevronLeft";
  currentIcon.value = (await ASIDE_ICONS[iconKey]()).default;
};

// Resolve every sidebar icon once on mount into iconMap. The computed
// moduleList / moduleBottomList read from this map, so toggling permissions
// doesn't require re-resolving images.
onMounted(async () => {
  const allKeys = [...MODULE_TOP, ...MODULE_BOTTOM].map((m) => m.iconKey);
  const resolved = {};
  for (const key of allKeys) {
    if (ASIDE_ICONS[key]) {
      try {
        resolved[key] = (await ASIDE_ICONS[key]()).default;
      } catch (_) {
        // missing icon is non-fatal
      }
    }
  }
  iconMap.value = resolved;

  // Preload icons used for collapse state
  await Promise.all([ASIDE_ICONS.chevronRight(), ASIDE_ICONS.chevronLeft()]);

  // Update the currentIcon based on the initial state of isCollapse
  await updateIcon();
});

function handleClick(item) {
  router.push(item.url);
}

const shouldShowLogout = computed(() => route.path !== "/login");

// logoutAction (in services/apis.js) hits POST /api/auth/logout best-effort
// and clears Pinia + localStorage internally, so all we have to do here is
// surface a toast and bounce the user to the login page.
const handleLogout = async () => {
  await service.logoutAction();
  ElMessage.success("登出成功");
  router.push("/login");
};

// Watch for changes in isCollapse to update the icon
watch(
  isCollapse,
  async () => {
    await updateIcon();
  },
  { immediate: true }
);
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.icon-svg {
  display: flex;
  align-items: center;
  height: 20px;
}

.el-menu-vertical-demo {
  /* background-color: #424242; */
  width: 65px;
  min-height: 400px;
}

.el-menu-item {
  color: #373535;
  border-radius: 6px;
  margin: 2px 5px;
}
/* .el-menu-item.is-active {
  color: #1ae71a;
}
.el-menu-item:hover {
  color: #1ae71a;
  background-color: transparent;
} */

.Release {
  color: #ffffff;
  position: absolute;
  bottom: 0;
  font-size: 6px;
  padding: 6px;
  margin: 10px;
  background-color: #424242;
}

/* Identity strip — shows the logged-in user's avatar, full name and role.
   When the sidebar is collapsed we hide the text and centre just the avatar. */
.identity-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin: 4px 8px 12px;
  border-radius: 8px;
  background: #f3f4f6;
}
.identity-strip.collapsed {
  justify-content: center;
  padding: 8px 0;
  margin: 4px 8px 12px;
}
.identity-strip .avatar {
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.identity-strip .identity-meta {
  flex: 1;
  min-width: 0;
  line-height: 1.2;
}
.identity-strip .identity-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.identity-strip .identity-role {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}
</style>
