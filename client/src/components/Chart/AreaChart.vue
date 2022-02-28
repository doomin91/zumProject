<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  data() {
    return {
      gradient: null,
      gradient2: null
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(0, 91, 100, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(0, 91, 130, 0.25)");
    this.gradient.addColorStop(1, "rgba(0, 91, 170, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.renderChart(
      {
        labels: [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24"
        ],
        datasets: [
          {
            label: "Data One",
            borderColor: "#556ee6",
            pointBackgroundColor: "#556ee6",
            borderWidth: 1,
            pointBorderColor: "#556ee6",
            backgroundColor: this.gradient,
            data: [40, 39, 10, 40, 39, 80, 40, 110, 180, 30, 40, 100, 40, 39, 10, 40, 39, 80, 40, 200, 80, 120, 40, 100 ]
          },
          {
            label: "Data Two",
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            backgroundColor: this.gradient2,
            data: [60, 33, 10, 60, 22, 120, 10, 110, 180, 30, 40, 180, 40, 39, 50, 30, 125, 80, 40, 110, 150, 150, 190, 130,]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
