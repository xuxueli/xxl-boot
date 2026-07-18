/**
 * RSA 加解密工具模块（jsencrypt.js）
 *
 * 职责：
 *   - 封装 JSEncrypt 库，提供对称于后端的 RSA 公钥加密 / 私钥解密能力。
 *   - 用于登录密码等敏感数据在传输前的加密处理，防止明文在网络中传输。
 *   - 公钥加密（encrypt）在前端调用，私钥解密（decrypt）通常仅在调试或特殊场景使用。
 *
 * ⚠️  安全说明：
 *   - 下方私钥为示例/测试用密钥，生产环境请替换并通过安全方式管理。
 *   - 密钥对生成工具参考：http://web.chacuo.net/netrsakeypair
 *
 * 依赖：
 *   - jsencrypt  轻量级 RSA 加解密库
 *
 * 典型用法：
 *   import { encrypt, decrypt } from '@/utils/jsencrypt'
 *   const cipherText = encrypt(password)   // 加密后发送给后端
 *   const plainText  = decrypt(cipherText)  // 解密（调试用）
 */
import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

// RSA 公钥（用于加密）：与后端配套，需保持一致
const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdH\n' +
  'nzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ=='

// RSA 私钥（用于解密）：⚠️ 仅用于测试，生产环境严禁将私钥暴露在前端代码中
const privateKey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqhHyZfSsYourNxaY\n' +
  '7Nt+PrgrxkiA50efORdI5U5lsW79MmFnusUA355oaSXcLhu5xxB38SMSyP2KvuKN\n' +
  'PuH3owIDAQABAkAfoiLyL+Z4lf4Myxk6xUDgLaWGximj20CUf+5BKKnlrK+Ed8gA\n' +
  'kM0HqoTt2UZwA5E2MzS4EI2gjfQhz5X28uqxAiEA3wNFxfrCZlSZHb0gn2zDpWow\n' +
  'cSxQAgiCstxGUoOqlW8CIQDDOerGKH5OmCJ4Z21v+F25WaHYPxCFMvwxpcw99Ecv\n' +
  'DQIgIdhDTIqD2jfYjPTY8Jj3EDGPbH2HHuffvflECt3Ek60CIQCFRlCkHpi7hthh\n' +
  'YhovyloRYsM+IS9h/0BzlEAuO0ktMQIgSPT3aFAgJYwKpqRYKlLDVcflZFCKY7u3\n' +
  'UP8iWi1Qw0Y='

/**
 * 使用公钥对明文进行 RSA 加密
 *
 * @param {string} txt - 待加密的明文字符串（如密码）
 * @returns {string|false} 加密后的 Base64 密文；加密失败时返回 false
 */
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

/**
 * 使用私钥对密文进行 RSA 解密
 *
 * @param {string} txt - 待解密的 Base64 密文字符串
 * @returns {string|false} 解密后的明文字符串；解密失败时返回 false
 */
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

