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
        <v-container style="max-width: 1200px;" class="mb-5">
          <v-row>
            <v-col
                cols="12"
                sm="4"
                md="2"
                class="mt-15"
            >
              <v-sheet
                  rounded="lg"
                  elevation="1"
              >
                <v-list color="transparent"
                >
                  <v-subheader>{{this.$parent.$parent.$parent.language.filter}}</v-subheader>
                  <v-list-item-group
                    v-model="selectedItem"
                    color="primary"
                    class="text-center"
                    >
                    <v-list-item
                        v-for="(item, i) in years"
                        :key="i"
                    >
                      <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-sheet>
              <v-sheet 
                  class="mt-3"
                      rounded="lg"
                      elevation="1"
                  >
                    <v-list color="transparent"
                    >
                      <v-subheader>{{this.$parent.$parent.$parent.language.filterCategory}}</v-subheader>
                      <v-list-item-group
                        v-model="selectedCategory"
                        color="primary"
                        class="text-center"
                        >
                        <v-list-item
                            v-for="(item, i) in categories"
                            :key="i"
                        >
                          <v-list-item-content>
                          <v-list-item-title v-text="item"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                </v-sheet>
                <v-sheet 
                  class="mt-3"
                  rounded="lg"
                  elevation="1"
                >
                  <v-list color="transparent"
                  >
                    <v-subheader>{{this.$parent.$parent.$parent.language.filterProject}}</v-subheader>
                    <v-list-item-group
                      v-model="selectedProject"
                      color="primary"
                      class="text-center"
                      >
                        <v-list-item
                          v-for="(item, i) in projects"
                          :key="i"
                        >
                          <!-- <v-list-item-icon>
                          <v-icon v-text="item.icon"></v-icon>
                          </v-list-item-icon> -->

                          <v-list-item-content>
                          <v-list-item-title v-text="item.name"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-sheet>
            </v-col>
            <v-col
                cols="12"
                md="10"
                sm="8"
            >
              <div
                v-for="category in filterCategories"
                :key="category"
              >

                <v-row class="mt-3"
                >
                  <h1
                  v-if="filterMembers
                          .find(p => 
                          p.category
                          .some(c => c.name == category))">
                          {{category}}
                  </h1>
                </v-row>
                <v-row>
                  <template v-for="(item, index) in filterMembers">
                    <Member 
                      :key="index"
                      v-if="item.category.some(c => c.name == category)"
                      :item="item"
                    />
                  </template>
                </v-row>
              </div>
            </v-col>
            </v-row>
        </v-container>
      </div>
      
    </div>
  </div>
  
</template>
<script>
import HoneyComb from "../components/HoneyComb.vue";
import Member from "../components/Member.vue"
import axios from 'axios'

export default {
    name: "People",
    components: {
      HoneyComb,
      Member
    },
    data: () => ({
      root: null,
      loading: true,
      errored: false,
      hidden: true,
      people: [],
      categories: [],
      years: [],
      projects: [],
      selectedItem: null,
      selectedProject: null,
      selectedCategory: null
    }),
    mounted() {
      axios
          .get(`${process.env.VUE_APP_API_URL}/member/`)
          .then(res => {
            this.people = res.data.data
            this.people = this.people.map( r => {
                  return {
                    ...r,
                    image: r.image ? '' + Buffer.from(r.image) : undefined,
                    contributionDate: Date.parse(r.contributionDate)
                  }
            }).sort((a, b) => b.contributionDate - a.contributionDate)
              .map(p => {
                return {
                  ...p,
                  contributionDate: new Date(p.contributionDate).toISOString()
                }

              })
            this.categories = this.people.flatMap(p => p.category)
                        .filter((v, i, a) => 
                        a.findIndex(t =>  t._id === v._id) === i)
                        .sort((a, b) => a.priority - b.priority)
                        .map( p => p.name)
            this.projects = this.people.flatMap(c => c.projectsIds)
                        .filter((v, i, a) => 
                        a.findIndex(t =>  t._id === v._id) === i)
            this.years = this.people
                          .map(p => new Date(p.contributionDate)
                          .getFullYear())
                          .filter((v, i, a) => a.indexOf(v) === i)
          })
          .catch(err => {
              console.error("axios err", err)
              this.errored = true
          })
          .finally(() => this.loading = false)
    },
    computed: {
      filterMembers: function(){
          if(!this.years[this.selectedItem] && !this.projects[this.selectedProject]) return this.people
          let newCards = []
          if(typeof this.selectedProject === 'number') {
              let project = this.projects[this.selectedProject]
              newCards = this.people.filter(c => 
                      c.projectsIds.some(p => p._id === project._id))
          } else newCards = this.people
          if(typeof this.selectedItem === 'number') {
              newCards = newCards.filter(c => new Date(c.contributionDate).getFullYear() == this.years[this.selectedItem])
          }
          return newCards
      },
      filterCategories: function(){
          if(typeof this.selectedCategory === 'number') return [this.categories[this.selectedCategory]]
          return this.categories
      }
    }

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
  :root {--Nhexa: 14;}
  section {margin: calc(var(--size) * .6) calc(var(--size) * 2.7) 0;}
}
@media only screen and (max-width: 1100px) {
	:root {--Nhexa: 10;}
  section {margin: calc(var(--size) * .6) calc(var(--size) * 1.8) 0;}
}
@media only screen and (max-width: 600px) {
	:root {--Nhexa: 8;}
  section {margin: calc(var(--size) * .6) calc(var(--size) * 1.4) 0;}
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