<template>
    <v-col 
    lg="4" sm="6" cols="12">

    <v-card
        class="ma-3 mb-2"
    >
        <v-img
        min-height="300"
        max-height="300"
        v-if="project.image"
        :src="project.image"
        ></v-img>
        <v-img
        min-height="300"
        max-height="300"
        v-else
        src="@/assets/default.jpg"
        ></v-img>

        <v-card-title>
            {{project.name}}
        </v-card-title>
        <v-card-subtitle>
            {{project.yearEnd ? 
            `${project.yearInit} - ${project.yearEnd}`
             : `${project.yearInit}`}}
        </v-card-subtitle>
        <v-card-actions>
            <v-btn
                :href="project.link"
                target="_blank"
                color="primary darken-2"
                text
            >
                {{this.$parent.$parent.$parent.$parent.language.learn}}
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
                icon
                @click="show = !show"
            >
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
        </v-card-actions>

        <v-expand-transition>
        <div v-show="show">
            <v-divider></v-divider>
            <v-card-text>
            {{project.description}}
            </v-card-text>
        </div>
        </v-expand-transition>
    </v-card>
    </v-col>
</template>
<script>


export default {
    name: 'Project',
    props: ['project'],
    data: () => ({
      show: false,
    }),
}
</script>