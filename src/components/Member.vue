<template>
    <v-col class="pa-1"
    lg="4" md="6" cols="12">
        <v-card
        >
        <v-card-title>
            {{item.fullName}}
        </v-card-title>

        <v-card-subtitle>
            {{item.contributionDate.substr(0, 10)}}
        </v-card-subtitle>

        <!-- <v-card-text class="font-weight-bold">
        </v-card-text> -->

        <v-card-actions>
            <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
                <v-img
                class="elevation-6"
                :src="item.image"
                :style="img"
                ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>
            <v-btn
                v-if="item.link"
                :href="item.link"
                target="_blank"
                color="primary darken-2"
                outlined
            >
                Link
            </v-btn></v-list-item-title>
            </v-list-item-content>
            

            <v-row
                align="center"
                justify="end"
            >

                <v-btn
                icon
                @click="show = !show"
                >
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </v-row>
            </v-list-item>
        </v-card-actions>
        <v-expand-transition>
            <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
                {{item.degree + '. ' + 
                item.description + '. ' +
                'Contact: ' +
                item.email + '. '}}
            </v-card-text>
            </div>
        </v-expand-transition>
        </v-card>
    </v-col>
</template>
<script>
  export default {
    name: 'Publication',
    props: ['item'],
    data: () => ({
      show: false
    }),
	computed: {
		img(){
			if(!this.item.active) return {"filter": "grayscale(100%)"}
			return {};
		}
	}
  }
</script>
