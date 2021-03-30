<template>
    <v-container style="max-width: 1200px;">
        <h1>
            {{this.$parent.$parent.$parent.language.publications}}
        </h1>
        <div class="text-center" v-if="errored">
            <h3>{{this.$parent.$parent.$parent.language.error}}</h3>
        </div>
        <div v-else>
            <div>
                <v-row>
                    <v-col
                        cols="12"
                        sm="12"
                        lg="2"
                    >
                        <div v-if="loading">
                            <v-skeleton-loader
                                class="mx-auto"
                                max-width="300"
                                type="list-item"
                            ></v-skeleton-loader>
                        </div>
                        <div v-else>

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
                                            <!-- <v-list-item-icon>
                                            <v-icon v-text="item.icon"></v-icon>
                                            </v-list-item-icon> -->

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
                        </div>
                    </v-col>
                    <v-col
                        cols="12"
                        lg="10"
                        sm="12"
                    >
                        <div v-if="loading">
                            <v-skeleton-loader
                                class="mx-auto"
                                type="list-item-avatar-three-line"
                            ></v-skeleton-loader>
                        </div>
                        <v-sheet v-else
                            min-height="70vh"
                            rounded="lg"
                        >
                        <div
                        v-for="category in filterCategories"
                        :key="category._id"
                        >
                            <h1 v-if="filterPublications.find(p => p.category.name === category.name)" 
                            class="text-center">
                                {{category.name}}
                            </h1>
                            <!-- <Publication
                            v-for="card in filterPublications"
                            :key="card.title"
                            :card="card"
                            /> -->
                            <ul
                            v-for="card in filterPublications"
                            :key="card.title"
                            :card="card"
                            class="ma-5">
                                <li v-if="card.category.name === category.name">
                                    {{card.author}}({{card.year}})
                                    .{{card.title}}.{{card.description}}
                                    {{card.editorial ? `[${card.editorial}]` : ''}}
                                    <a v-if="card.doi" :href="card.doi">DOI</a>
                                </li>
                            </ul>
                        </div>
                                
                        </v-sheet>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>
// import Publication from '@/components/Publication.vue'
import axios from 'axios'

export default {
    name: "Publications",
    // components: {
    //     Publication
    // },
    data: () => ({
        selectedItem: null,
        selectedCategory: null,
        years: [],
        cards: [],
        categories: [],
        loading: true,
        errored: false
    }),
    mounted() {
        axios
            .get(`${process.env.VUE_APP_API_URL}/publication/`)
            .then(res => {
                this.cards = res.data.data
                this.years = this.cards.map( c => c.year )
                                .filter((value, index, self) => self.indexOf(value) === index)
                                .sort((a, b) => a - b)
                this.cards.forEach( c => {
                    if(!this.categories.find(
                        cat => cat.name == c.category.name )){
                        this.categories.push(c.category)
                    }
                })
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
    computed: {
        filterPublications: function(){
            if(!this.years[this.selectedItem]) return this.cards
            return this.cards.filter(c => c.year == this.years[this.selectedItem])
        },
        filterCategories: function(){
            if(typeof this.selectedCategory === 'number') return [this.categories[this.selectedCategory]]
            return this.categories
        }
    }
}
</script>