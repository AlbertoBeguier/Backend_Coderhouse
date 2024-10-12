Hola estimados, comento el proyecto para que les resulte más sencilla la corrección.

1. El proyecto corre con "yarn dev"
2. He correjido las sugerencias de la primer entrega
3. La mayoría del proyecto tiene vistas
4. Se ha modificado la capa de persistencia DAO para carritos y usuarios para json y mongo
   solo basta cambiar aquí \src\config\configDao.js useJsonStorage: false a true para que trabeja con json -- se reconoceran productos json porque entes del oriducto he agragado la palabra JSON.
5. se ha implementado el patrón repository para trabajar con el DAO.
6. Solo el administrador puede ingresar mediante el boton RealTimeProducts y agrega y elminar productos. Al probar el sistema crear dos ususarios uno con el rol de administrador y el otro rol user.
7. Se ha creado el modelo Ticket con todas las formalidades requeridas
8. En relacion al stock del producto al ir agregando los pruductos al carrito el stock se va a actualizando por lo que si el stock es 0 no se puede agregar directamente al carrito, me ha parecido mejor así que como se solicita.
9. Por lo antes dicho , el carrito al finalizaqr la compra estará vació ya que nunca existiran productos dentro de él que no puedan comprarse.
