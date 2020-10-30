export type Stage = {
  id: string
}

export type GlobalResult = {
  id?: string
  stage: Stage
  selected_color: Color
  previous_color: Color
  matched: boolean
}

export type PlayerResult = {
  lineUser: LineUser
  id?: string
  selected_color: Color
  previous_color: Color
  matched: boolean
  win_streak_count: number
}

export type LineUser = {
  id: string
}

const ColorTypes = ["red", "green", "blue", "yellow"];
export type Color = "red" | "green" | "blue" | "yellow";

export class GameManager {
  public static validColorType(color: string): boolean {
    return ColorTypes.find(e => e == color) != undefined;
  }
}