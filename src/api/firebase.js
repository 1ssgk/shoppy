import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { getDatabase, ref, set, get, remove } from "firebase/database";
import { v4 as uuid } from "uuid";

/* firebaseConfig 설정 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

/* authenticate */
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

/* realtime db */
const database = getDatabase(app);

/* firebase google 로그인 */
export function login() {
  signInWithPopup(auth, provider).catch((error) => console.error(error));
}

/* firebase google 로그아웃 */
export function logout() {
  signOut(auth).catch((error) => console.error(error));
}

/* 왜 이건 콜백으로 한건지... 흠... 궁금하구만 
   return이 함수면 콜백을 써야하나? */
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updateUser = user ? await adminUser(user) : null;
    callback(updateUser);
  });
}

/* Admin 체크 */
async function adminUser(user) {
  return get(ref(database, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
      return user;
    });
}

/* 새 제품 등록 */
export async function addNewProduct(product, imageURL) {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image: imageURL,
    options: product.options.split(","),
  });
}

/* 전체 제품 가져오기 */
export async function getProducts() {
  return get(ref(database, "products")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    });
}

/* 특정 제품 가져오기 */
export async function getProduct(product) {
  const { id } = product;
  return get(ref(database, `products/${id}`)) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    });
}

/* 쇼핑 카트 가져오기 */
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      return Object.values(items);
    });
}

/* 쇼핑 카트 추가 or 수정 */
export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
}

/* 쇼핑 카트 삭제 */
export async function removeFromCart(userId, productId) {
  return remove(ref(database, `carts/${userId}/${productId}`));
}
