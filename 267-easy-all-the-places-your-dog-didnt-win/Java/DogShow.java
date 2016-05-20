public class DogShow {

  public static void placements(int pos, int placings){

    if (pos < 0 || pos > placings || placings < 0) return;

    StringBuilder builder = new StringBuilder();

    for(int i = 0; i <= placings; i++){

      if (i == pos) continue;

      builder.append(i);

      if (i < 11 && i > 13){
        switch(i % 10){
          case 1:
            builder.append("st"); break;
          case 2:
            builder.append("nd"); break;
          case 3:
            builder.append("rd"); break;
          default:
            builder.append("th");
        }
      } else {
        builder.append("th");
      }
      builder.append(", ");
    }
    System.out.println(builder.toString());
  }

  public static void main(String... args){
    placements(1, 100);
    placements(12, 100);
    placements(-1, 100);
    placements(101, 200);
  }
}