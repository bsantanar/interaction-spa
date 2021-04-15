<template>
  <div>
    <div class="text-center">
      <h1>{{this.$parent.$parent.$parent.language.people}}</h1>
    </div>
    <div class="text-center" v-if="errored">
        <h3>{{this.$parent.$parent.$parent.language.error}}</h3>
    </div>
    <div v-else>
      <div 
        v-if="loading"
        class="text-center mt-5"
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-else>

        <section>
          <HoneyComb 
            v-for="person in people"
            :key="person.name"
            :person="person"
          />
        </section>
        <v-container style="max-width: 1200px;">
          <div
          v-for="category in categories"
          :key="category"
          >

          <v-row 
          >
              <h1>{{category}}</h1>
          </v-row>
          <v-row>
            <template v-for="(item, index) in people">

                <v-col
                    cols="4"
                    :key="index"
                      v-if="item.category.some(c => c.name == category)">
                    <v-card
                      min-height="200px"
                    >
                    <v-card-title>
                      <span class="title font-weight-light">
                        {{item.fullName + ' - ' + 
                      item.contributionDate.substr(0, 10)}}</span>
                    </v-card-title>

                    <v-card-text class="font-weight-bold">
                      {{item.degree + '. ' + 
                      item.description + '. ' +
                      'Contact: ' +
                      item.email + '. '}}
                    </v-card-text>

                    <v-card-actions>
                      <v-list-item class="grow">
                        <v-list-item-avatar color="grey darken-3">
                          <v-img
                            class="elevation-6"
                            :src="item.image"
                          ></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>
                        <v-btn
                            v-if="item.link"
                            :href="item.link"
                            color="primary darken-2"
                            outlined
                        >
                            Link
                        </v-btn></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card-actions>
                  </v-card>
                </v-col>
            </template>
            </v-row>
          </div>
        </v-container>
      </div>
      
    </div>
  </div>
  
</template>
<script>
import HoneyComb from "../components/HoneyComb.vue";
import axios from 'axios'

export default {
    name: "People",
    components: {
      HoneyComb
    },
    // updated: function () {
    // },
    mounted() {
      axios
          .get(`${process.env.VUE_APP_API_URL}/member/`)
          .then(res => {
            this.people = res.data.data
            this.people = this.people.map( r => {
                  return {
                      ...r,
                      image: r.image ? '' + Buffer.from(r.image) : undefined
                  }
            })
                this.categories = this.people.flatMap(p => p.category)
                            .filter((v, i, a) => 
                            a.findIndex(t =>  t._id === v._id) === i)
                            .map( p => p.name)
          })
          .catch(err => {
              console.error("axios err", err)
              this.errored = true
          })
          .finally(() => this.loading = false)
    },
    data: () => ({
      root: null,
      loading: true,
      errored: false,
      hidden: true,
      people: [],
      categories: []
    }),

}
</script>

<style>
*, *:after, *:before {box-sizing: inherit;}
* {position: relative;}
:root {
	--sinSerif: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
	--Nhexa: 4;
	--gap: 1vw;
	--size: calc(calc(90vw / var(--Nhexa)) - var(--gap));
}
@media only screen and (min-width: 1100px) {
  :root {--Nhexa: 10;}
  section {margin: calc(var(--size) * .6) calc(var(--size) * 1.8) 0;}
}
@media only screen and (max-width: 1100px) {
	:root {--Nhexa: 6;}
  section {margin: calc(var(--size) * .6) calc(var(--size) * .9) 0;}
}
@media only screen and (max-width: 600px) {
	:root {--Nhexa: 4;}
  section {margin: calc(var(--size) * .6) calc(var(--size) * .6) 0;}
}
html {
	background: #e9e9e7;
  box-sizing: border-box;
	font-family: var(--sinSerif);
	font-size: 1rem;
}
body {
	overflow-X: hidden;
	hyphens: auto;
}
section {
  width: calc(var(--size) * calc(var(--Nhexa) - 1));
	display: grid;
	grid-template-columns: repeat(var(--Nhexa), 1fr);
	grid-gap: var(--gap);
}
body > p {
	font-size: 1.5rem;
	margin: 2rem 0 1rem calc(var(--size) * .5);
	font-weight: 200;
}
</style>