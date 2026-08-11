import type { StaticImageData } from "next/image";
import abhinav from "../landing-page/assets/testimonials/abhinav.webp";
import drac from "../landing-page/assets/testimonials/drac.webp";
import fred from "../landing-page/assets/testimonials/fred.webp";
import giantlemur from "../landing-page/assets/testimonials/giantlemur.webp";
import github from "../landing-page/assets/testimonials/github.webp";
import jj from "../landing-page/assets/testimonials/jj.webp";
import kazzybits from "../landing-page/assets/testimonials/kazzybits.webp";
import kcash from "../landing-page/assets/testimonials/kcash.webp";
import laura from "../landing-page/assets/testimonials/laura.webp";
import lukas from "../landing-page/assets/testimonials/lukas.webp";
import mArtigiani from "../landing-page/assets/testimonials/m_artigiani.webp";
import nanouss01 from "../landing-page/assets/testimonials/nanouss01.webp";
import oleksandra from "../landing-page/assets/testimonials/oleksandra.webp";
import redrobio from "../landing-page/assets/testimonials/redrobio.webp";
import ricksn from "../landing-page/assets/testimonials/ricksn.webp";
import rob from "../landing-page/assets/testimonials/rob.webp";
import sharpiemath from "../landing-page/assets/testimonials/sharpiemath.webp";
import shaun from "../landing-page/assets/testimonials/shaun.webp";
import thom from "../landing-page/assets/testimonials/thom.webp";
import vignesh from "../landing-page/assets/testimonials/vignesh.webp";

/**
 * The presentational avatars, looked up by the filename the testimonials'
 * STRUCTURE references (content/src/testimonials/structure.json).
 *
 * The filename is locale-invariant and so is this map: an avatar is a picture of
 * a person, not a piece of copy, which is why it never appears in a translated
 * catalog. Both the landing section and the /testimonials page render the same
 * people, so they share one map rather than keeping a copy each.
 */
export const avatars: Record<string, StaticImageData> = {
  "abhinav.webp": abhinav,
  "drac.webp": drac,
  "fred.webp": fred,
  "giantlemur.webp": giantlemur,
  "github.webp": github,
  "jj.webp": jj,
  "kazzybits.webp": kazzybits,
  "kcash.webp": kcash,
  "laura.webp": laura,
  "lukas.webp": lukas,
  "m_artigiani.webp": mArtigiani,
  "nanouss01.webp": nanouss01,
  "oleksandra.webp": oleksandra,
  "redrobio.webp": redrobio,
  "ricksn.webp": ricksn,
  "rob.webp": rob,
  "sharpiemath.webp": sharpiemath,
  "shaun.webp": shaun,
  "thom.webp": thom,
  "vignesh.webp": vignesh
};
