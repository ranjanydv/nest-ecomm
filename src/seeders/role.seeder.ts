import { Injectable, Logger } from '@nestjs/common';
import { Role } from 'src/core/domain/role/role.domain';
import { Privilege } from 'src/core/domain/privilege/privilege.domain';
import { RoleUseCase } from 'src/core/ports/in/role/role-usecase.port';
import {
  PRIVILEGE_NAME,
  PRIVILEGE_SUBNAME,
} from 'src/common/enums/privilege/privilege.enum';

@Injectable()
export class RoleSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly roleUseCase: RoleUseCase,
  ) {}

  async seed(privileges: Privilege[]) {
    if ((await this.roleUseCase.countRoles({})) > 0) {
      const [roles] = await this.roleUseCase.getAllRoles(
        { roleName: 'SUPERADMIN' },
        { pagination: false },
      );

      return roles?.[0];
    }

    // Filter privileges for different roles
    const vendorPrivileges = privileges.filter((privilege) =>
      [
        'PRODUCT_MANAGEMENT',
        'ORDER_MANAGEMENT',
        'CATEGORY_MANAGEMENT',
        'COUPON_MANAGEMENT',
      ].includes(privilege.privilegeName),
    );

    const staffPrivileges = privileges.filter((privilege) =>
      [
        'ORDER_MANAGEMENT',
        'USER_MANAGEMENT',
        'REVIEW_MANAGEMENT',
        'PAYMENT_MANAGEMENT',
        'SHIPPING_MANAGEMENT',
      ].includes(privilege.privilegeName),
    );

    const userPrivileges = privileges.filter(
      (privilege) =>
        privilege.privilegeName === PRIVILEGE_NAME.PRODUCT_MANAGEMENT &&
        privilege.privilegeSubName === PRIVILEGE_SUBNAME.PRODUCT_VIEW,
    );

    const role = await this.roleUseCase.createBulkRole([
      Role.create({
        roleName: 'SUPERADMIN',
        privileges, // All privileges
      }),
      Role.create({
        roleName: 'VENDOR',
        privileges: vendorPrivileges, // Product, Order, Category, Coupon management
      }),
      Role.create({
        roleName: 'STAFF',
        privileges: staffPrivileges, // Order, User, Review, Payment, Shipping management
      }),
      Role.create({
        roleName: 'USER',
        privileges: userPrivileges, // Only product view
      }),
    ]);

    this.logger.debug('Roles created : ' + JSON.stringify(role, null, 2));

    return role;
  }
}
