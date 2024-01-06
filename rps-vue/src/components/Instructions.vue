<template>
    <div class="container">
        <h2 class="text-center mt-2">Instructions</h2>
        <p class="text-center">
            <span>Tap/Click on Left </span>
            <span>and right arrows below</span>
            <span class="material-symbols-outlined">arrow_circle_left</span>
            <span class="material-symbols-outlined">arrow_circle_right</span>
            <span>or use keyboard arrows to choose Rock/Paper/Scissors. Once you decide,click the image between the arrows to play or use Enter Key if you are using keyboard</span>
        </p>
        
    </div>
</template>

<script>
    export default {
        name:'instructions'
    }
</script>

<style lang="css" scoped>
.material-symbols-outlined{
    font-size: 1.25rem;
    margin: 0 .25rem;
    color: rgb(122, 13, 13);
    
}

</style>